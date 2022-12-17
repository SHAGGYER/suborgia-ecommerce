import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import { CustomDialog, useDialog } from "react-st-modal";
import PrimaryButton from "../components/UI/PrimaryButton";
import FloatingTextField from "../components/FloatingTextField";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import DataTable from "react-data-table-component";
import ResourceBrowser from "../components/ResourceBrowser";

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

const CreateCategoryDialogStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
`;

export const CreateCategoryDialog = ({ onCreated }) => {
  const dialog = useDialog();
  const [name, setName] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      return;
    }

    await HttpClient().post("/api/categories", {
      name,
      description: "test",
    });

    onCreated && onCreated();
    dialog.close(name);
  };

  return (
    <CreateCategoryDialogStyled onSubmit={onSubmit}>
      <h1>Create Category</h1>
      <FloatingTextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <PrimaryButton onClick={() => dialog.close(name)}>Add</PrimaryButton>
    </CreateCategoryDialogStyled>
  );
};

export default function Categories() {
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (refetch) {
      setRefetch(false);
    }
  }, [refetch]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    /*     {
      name: "Price",
      selector: "price",
      sortable: true,
      format: (row) => `${row.price} kr.`,
    }, */
    {
      name: "Edit",
      button: true,
      cell: (row) => <PrimaryButton onClick={() => null}>Edit</PrimaryButton>,
    },
  ];

  const openCreateCategoryDialog = async () => {
    const result = await CustomDialog(<CreateCategoryDialog />);
    if (result) {
      setRefetch(true);
    }
  };

  return (
    <Page>
      <PrimaryButton onClick={openCreateCategoryDialog}>
        New Category
      </PrimaryButton>

      <ResourceBrowser
        name="Categories"
        url="/api/categories"
        columns={columns}
        refetch={refetch}
      />
    </Page>
  );
}
