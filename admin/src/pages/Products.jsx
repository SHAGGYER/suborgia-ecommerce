import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import FloatingTextField from "../components/FloatingTextField";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import { CustomDialog, Confirm } from "react-st-modal";
import ProductForm from "../components/ProductForm";
import AppContext from "../AppContext";

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        doSearch();
      }}
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <FloatingTextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Søg..."
      />
      <PrimaryButton type="submit">Søg</PrimaryButton>
    </form>
  );
};

function Products() {
  const { shops } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [columns, setColumns] = useState([
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Shop",
      selector: "shop.name",
      cell: (row) => row.shop?.name,
    },
    {
      name: "SKU",
      selector: "sku",
      sortable: true,
    },
    {
      name: "Sell Price",
      selector: "sellPrice",
      cell: (row) => parseFloat(row.sellPrice).toFixed(2),
      sortable: true,
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true,
    },
    {
      name: "Actions",
      selector: "actions",
      cell: (row) => (
        <PrimaryButton onClick={() => openEditDialog(row)}>Edit</PrimaryButton>
      ),
    },
    /*    {
      name: "Created At",
      selector: "createdAt",
      sortable: true,
      format: (row) => moment(row.createdAt).format("DD-MM-YYYY"),
    },*/
  ]);

  useEffect(() => {
    fetchRows(1);
  }, []);

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <div
        className="flex gap-4 items-center justify-between"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{selectedCount} valgt rækker</span>
        <PrimaryButton onClick={() => deleteSelectedRows()}>
          Delete
        </PrimaryButton>
      </div>
    );
  };

  const deleteSelectedRows = async () => {
    const result = await Confirm(
      "You are about to delete the selected rows",
      "Please Confirm"
    );
    if (result) {
      const ids = selectedRows.map((x) => x._id);
      await HttpClient().post(`/api/products/delete`, { ids });
      await fetchRows(currentPage, search);
      setToggleCleared(!toggleCleared);
      setSelectedRows([]);
    }
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

  const fetchRows = async (page, searchQuery = "") => {
    setLoading(true);
    setCurrentPage(page);

    const response = await HttpClient().get(
      `/api/products?page=${page}&search=${searchQuery}`
    );

    setRows(response.data.content);
    setTotalRows(response.data.totalRows);

    setLoading(false);
  };

  const openEditDialog = async (row) => {
    const result = await CustomDialog(<ProductForm row={row} shops={shops} />);
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const openCreateDialog = async () => {
    const result = await CustomDialog(<ProductForm shops={shops} />);
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  return (
    <>
      <PrimaryButton onClick={openCreateDialog}>Nyt Produkt</PrimaryButton>

      <DataTable
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
        selectableRows={true}
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
    </>
  );
}

export default Products;
