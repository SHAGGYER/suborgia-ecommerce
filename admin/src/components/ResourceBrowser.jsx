import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/UI/PrimaryButton";
import FloatingTextField from "../components/FloatingTextField";
import HttpClient from "../services/HttpClient";
import DataTable from "react-data-table-component";
import { UI } from "./UI/UI";
import { Confirm, useDialog } from "react-st-modal";

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <FloatingTextField
        label={"Search..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <PrimaryButton onClick={doSearch}>Søg</PrimaryButton>
    </div>
  );
};

export default function ResourceBrowser({
  name,
  columns,
  url,
  refetch,
  onSelect,
}) {
  const dialog = useDialog();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  if (onSelect) {
    columns.push({
      name: "Select",
      cell: (row) => (
        <PrimaryButton
          onClick={() => {
            onSelect(row);
          }}
        >
          Select
        </PrimaryButton>
      ),
    });
  }

  useEffect(() => {
    if (refetch) {
      fetchResources(page, search);
    }
  }, [refetch]);

  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async (page = 1, search = "") => {
    setLoading(true);
    const { data } = await HttpClient().get(
      url + "?page=" + page + "&search=" + search
    );
    setData(data.content.data);
    setTotalRows(data.content.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchResources(page, search);
    setPage(page);
  };

  const doSearch = async () => {
    await fetchResources(1, search);
  };

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  const deleteSelectedRows = async () => {
    const result = await Confirm(
      "You are about to remove this user's account.",
      "Please Confirm."
    );
    if (result) {
      const ids = selectedRows.map((x) => x.id);
      await HttpClient().post(url + "/delete", { ids });
      const newData = data.filter((x) => !ids.includes(x.id));
      setData(newData);
      setToggleCleared(!toggleCleared);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <UI.FlexBox justify="space-between" align="center">
        <span>{selectedCount} rows</span>
        <UI.Button error onClick={() => deleteSelectedRows()}>
          Delete
        </UI.Button>
      </UI.FlexBox>
    );
  };

  return (
    <DataTable
      title={name}
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      clearSelectedRows={toggleCleared}
      onChangePage={handlePageChange}
      selectableRows
      onSelectedRowsChange={handleSelectedRows}
      contextComponent={<DeleteSelectedRowsAction />}
      subHeader
      paginationPerPage={15}
      paginationRowsPerPageOptions={[15, 30]}
      subHeaderComponent={
        <SearchComponent
          search={search}
          setSearch={setSearch}
          doSearch={doSearch}
        />
      }
    />
  );
}
