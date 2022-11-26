import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import HttpClient from "../services/HttpClient";
import { Confirm } from "react-st-modal";
import { UI } from "../components/UI/UI";
import { Form } from "../components/UI/Form";
import moment from "moment";
import { Link } from "react-router-dom";
import PrimaryButton from "../components/UI/PrimaryButton";
import { CustomDialog } from "react-st-modal";
import PlanDialog from "../components/PlanDialog";

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Form.TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søg..."
      />
      <PrimaryButton onClick={doSearch}>Søg</PrimaryButton>
    </div>
  );
};

function Plans(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [toggleCleared, setToggleCleared] = useState(false);

  const openPlanDialog = async (row) => {
    const result = await CustomDialog(<PlanDialog plan={row} />);
    if (result) {
      await fetchResources(1);
    }
  };

  const columns = [
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
      format: (row) => `${row.price} kr.`,
    },
    {
      name: "Stripe ID",
      selector: "stripeId",
      sortable: true,
    },
    {
      name: "Edit",
      button: true,
      cell: (row) => (
        <PrimaryButton onClick={() => openPlanDialog(row)}>
          Redigér
        </PrimaryButton>
      ),
    },
  ];

  useEffect(() => {
    fetchResources(1);
  }, []);

  const fetchResources = async (page, searchQuery = "") => {
    setLoading(true);

    const response = await HttpClient().get(
      `/api/admin/plan?page=${page}&per_page=${perPage}&search=${searchQuery}`
    );

    setData(response.data.plans);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchResources(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await HttpClient().get(
      `/api/admin/plan?page=${page}&per_page=${newPerPage}`
    );

    setData(response.data.plan);
    setPerPage(newPerPage);
    setLoading(false);
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
      const ids = selectedRows.map((x) => x._id);
      await HttpClient().post("/api/admin/plan/delete", { ids });
      const newData = data.filter((x) => !ids.includes(x._id));
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

  const doSearch = async () => {
    await fetchResources(1, search);
  };

  const openCreatePlanDialog = async () => {
    const result = await CustomDialog(<PlanDialog />);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <PrimaryButton onClick={openCreatePlanDialog}>Opret Plan</PrimaryButton>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        clearSelectedRows={toggleCleared}
        onChangePage={handlePageChange}
        selectableRows
        onChangeRowsPerPage={handlePerRowsChange}
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
    </div>
  );
}

export default Plans;
