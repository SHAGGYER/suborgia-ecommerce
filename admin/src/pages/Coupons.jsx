import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import ResourceBrowser from "../components/ResourceBrowser";

export default function Coupons() {
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (refetch) {
      setRefetch(false);
    }
  }, [refetch]);

  const columns = [
    {
      name: "Code",
      selector: "code",
      sortable: true,
    },
    {
      name: "Percentage",
      selector: "percentage",
      sortable: true,
      format: (row) => `${row.percentage}%`,
    },
  ];

  return (
    <Page>
      <div>
        <ResourceBrowser
          name="Coupons"
          url="/api/coupons"
          columns={columns}
          refetch={refetch}
        />
      </div>
    </Page>
  );
}
