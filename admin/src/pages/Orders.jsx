import React from "react";
import Page from "../components/Page";
import ResourceBrowser from "../components/ResourceBrowser";

export default function Orders() {
  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Total",
      selector: "total",
      sortable: true,
      format: (row) => `$${row.total}`,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
  ];

  return (
    <Page>
      <ResourceBrowser url="/api/orders" name="Orders" columns={columns} />
    </Page>
  );
}
