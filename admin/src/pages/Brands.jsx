import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import { CustomDialog, useDialog } from "react-st-modal";
import PrimaryButton from "../components/UI/PrimaryButton";
import styled from "styled-components";
import { ProductUpdateCreateDialog } from "../components/ProductUpdateCreateDialog";
import MyResourceBrowser from "../components/MyResourceBrowser";
import moment from "moment";
import { BrandUpdateCreateDialog } from "../components/BrandUpdateCreateDialog";

export default function Brands() {
  const columns = [
    {
      name: "ID",
      key: "id",
    },
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Category",
      cell: (row) => <div>{row.category?.name}</div>,
    },
    {
      name: "Created At",
      key: "created_at",
      cell: (row) => `${moment(row.created_at).format("DD/MM/YYYY")}`,
    },
  ];

  return (
    <Page>
      <MyResourceBrowser
        title="Brands"
        url="/api/brands"
        newRow={{
          name: "A new brand",
          category: null,
        }}
        columns={columns}
        templateColumns="50px 150px 150px 1fr"
        component={BrandUpdateCreateDialog}
      />
    </Page>
  );
}
