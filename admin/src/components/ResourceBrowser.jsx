import React, { useContext, useEffect, useState } from "react";
import FloatingTextField from "./FloatingTextField";
import PrimaryButton from "./UI/PrimaryButton";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import DataTable from "react-data-table-component";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";

export const RESOURCE_MODE = {
  VIEW: "view",
  UPDATE: "update",
  NEW: "new",
};

const CreateDialog = ({ component: Component, ...props }) => {
  const dialog = useDialog();
  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component onCreated={(row) => dialog.close(row)} {...props} />
    </div>
  );
};

const ViewDialog = ({ component: Component, ...props }) => {
  const dialog = useDialog();
  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component
        {...props}
        mode={RESOURCE_MODE.VIEW}
        close={() => dialog.close()}
      />
    </div>
  );
};

const EditDialog = ({ row, component: Component, ...props }) => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component row={row} onUpdated={(row) => dialog.close(row)} {...props} />
    </div>
  );
};

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <div className="flex gap-4 items-end">
      <FloatingTextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Søg..."
      />
      <PrimaryButton onClick={doSearch}>Søg</PrimaryButton>
    </div>
  );
};

function ResourceBrowser({
  shop,
  bigDialog,
  selectMode,
  modes,
  createComponent,
  editComponent,
  viewComponent,
  url,
  onSelect,
  title,
  ...props
}) {
  const { purchases, setPurchases, shops } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [toggleCleared, setToggleCleared] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([...props.columns]);

  useEffect(() => {
    setColumns([
      ...columns,
      {
        name: "Actions",
        selector: "actions",
        cell: (row) =>
          !selectMode ? (
            <div className="flex gap-1">
              {modes.includes(RESOURCE_MODE.UPDATE) && (
                <PrimaryButton onClick={() => openEditDialog(row)}>
                  Edit
                </PrimaryButton>
              )}
              {modes.includes(RESOURCE_MODE.VIEW) && (
                <PrimaryButton onClick={() => openViewDialog(row)}>
                  View
                </PrimaryButton>
              )}
            </div>
          ) : (
            <PrimaryButton onClick={() => onSelect(row)}>Select</PrimaryButton>
          ),
      },
    ]);
    fetchRows(1);
  }, [selectMode]);

  const openCreateDialog = async () => {
    const result = await CustomDialog(
      <CreateDialog component={createComponent} shops={shops} />,
      {
        className: bigDialog ? "big-dialog" : "",
      }
    );
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const openEditDialog = async (row) => {
    const result = await CustomDialog(
      <EditDialog component={editComponent} row={row} shops={shops} />,
      { className: bigDialog ? "big-dialog" : "" }
    );
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const openViewDialog = async (row) => {
    await CustomDialog(
      <ViewDialog
        shop={shop}
        purchases={purchases}
        setPurchases={setPurchases}
        component={viewComponent}
        row={row}
      />,
      {
        className: bigDialog ? "big-dialog" : "",
      }
    );
    await fetchRows(currentPage, search);
  };

  const fetchRows = async (page, searchQuery = "") => {
    setLoading(true);
    setCurrentPage(page);

    const response = await HttpClient().get(
      `${url}?page=${page}&search=${searchQuery}`
    );

    setRows(response.data.content);
    setTotalRows(response.data.totalRows);

    setLoading(false);
  };

  const handlePageChange = async (page) => {
    await fetchRows(page, search);
  };

  const doSearch = async () => {
    await fetchRows(1, search);
  };

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  const deleteSelectedRows = async () => {
    const result = await Confirm(
      "You are about to delete the selected rows",
      "Please Confirm"
    );
    if (result) {
      const ids = selectedRows.map((x) => x._id);
      await HttpClient().post(`${url}/delete`, { ids });
      await fetchRows(currentPage, search);
      setToggleCleared(!toggleCleared);
      setSelectedRows([]);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <div className="flex gap-4 items-center justify-between">
        <span>{selectedCount} selected rows</span>
        <PrimaryButton onClick={() => deleteSelectedRows()}>
          Delete
        </PrimaryButton>
      </div>
    );
  };

  const handleRowClicked = async (row, event) => {
    event.preventDefault();
    await openViewDialog(row);
  };

  return (
    <>
      {modes.includes(RESOURCE_MODE.NEW) && (
        <PrimaryButton onClick={openCreateDialog}>New</PrimaryButton>
      )}

      <div className="mt-4">
        <DataTable
          title={title}
          columns={columns}
          data={rows.filter((x) => !x.deletedAt)}
          onRowClicked={(row, event) => handleRowClicked(row, event)}
          progressPending={loading}
          pagination
          paginationServer
          noHeader={true}
          paginationTotalRows={totalRows}
          clearSelectedRows={toggleCleared}
          onChangePage={handlePageChange}
          selectableRows={!selectMode ?? true}
          onSelectedRowsChange={handleSelectedRows}
          subHeader
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10]}
          subHeaderComponent={
            <div className="flex gap-4 w-full justify-between items-center">
              <SearchComponent
                search={search}
                setSearch={setSearch}
                doSearch={doSearch}
              />
              {!!selectedRows.length && (
                <DeleteSelectedRowsAction selectedCount={selectedRows.length} />
              )}
            </div>
          }
        />
      </div>
    </>
  );
}

export default ResourceBrowser;
