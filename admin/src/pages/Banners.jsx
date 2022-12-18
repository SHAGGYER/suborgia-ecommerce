import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import { CustomDialog, useDialog } from "react-st-modal";
import PrimaryButton from "../components/UI/PrimaryButton";
import styled from "styled-components";
import { ProductUpdateCreateDialog } from "../components/ProductUpdateCreateDialog";
import MyResourceBrowser from "../components/MyResourceBrowser";
import moment from "moment";

const ViewProduct = ({ row }) => {
  const dialog = useDialog();
  return (
    <ProductUpdateCreateDialog
      row={row.product}
      onUpdated={() => dialog.close(true)}
    />
  );
};

/* 
  ShowRow modal
*/

const ShowRowStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: white;

  img {
    width: 100%;
    height: 350px;
    object-fit: cover;
  }
`;

const ShowRow = ({ row }) => {
  const dialog = useDialog();
  return (
    <ShowRowStyled>
      <img src={row.file_path} />
    </ShowRowStyled>
  );
};

export default function Banners() {
  const openShowRow = async (row) => {
    await CustomDialog(<ShowRow row={row} />, {
      title: "Banner",
      showCloseIcon: true,
    });
  };

  const openViewProduct = async (row) => {
    await CustomDialog(<ViewProduct row={row} />, {
      title: "Product",
      showCloseIcon: true,
      className: "big-modal",
    });
  };

  const columns = [
    {
      name: "Preview Image",
      key: "file_path",
      cell: (row) => (
        <img
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
          src={row.file_path}
        />
      ),
    },
    {
      name: "Created At",
      key: "created_at",
      cell: (row) => `${moment(row.created_at).format("DD/MM/YYYY")}`,
    },
    {
      name: "Product",
      key: "product",
      cell: (row) => (
        <a
          style={{ textDecoration: "none", color: "var(--primary)" }}
          href="#"
          onClick={() => openViewProduct(row)}
        >
          {row.product?.name}
        </a>
      ),
    },
    {
      name: "View",
      key: "view",
      sortable: true,
      cell: (row) => (
        <PrimaryButton onClick={() => openShowRow(row)}>View</PrimaryButton>
      ),
    },
  ];

  return (
    <Page>
      <div>
        <MyResourceBrowser
          templateColumns="repeat(4, 1fr)"
          title="Banners"
          url="/api/banners"
          columns={columns}
        />
      </div>
    </Page>
  );
}
