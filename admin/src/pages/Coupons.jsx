import React, { useEffect, useState } from "react";
import { CouponUpdateCreateDialog } from "../components/CouponUpdateCreateDialog";
import MyResourceBrowser from "../components/MyResourceBrowser";
import Page from "../components/Page";

export default function Coupons() {
  const columns = [
    {
      name: "Code",
      key: "code",
    },
    {
      name: "Percentage",
      key: "percentage",
      cell: (row) => `${row.percentage}%`,
    },
  ];

  return (
    <Page>
      <MyResourceBrowser
        templateColumns="150px 1fr"
        title="Coupons"
        url="/api/coupons"
        component={CouponUpdateCreateDialog}
        columns={columns}
        newRow={{
          code: "New Code",
          percentage: "",
        }}
      />
    </Page>
  );
}
