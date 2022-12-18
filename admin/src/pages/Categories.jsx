import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import MyResourceBrowser from "../components/MyResourceBrowser";
import { CategoryUpdateCreateDialog } from "../components/CategoryUpdateCreateDialog";

export default function Categories() {
  return (
    <Page>
      <MyResourceBrowser
        title={"Categories"}
        url="/api/categories"
        component={CategoryUpdateCreateDialog}
        newRow={{
          name: "A new category",
        }}
        templateColumns="50px 1fr"
        columns={[
          { name: "ID", key: "id", width: "50px" },
          { name: "Name", key: "name", width: "100%" },
        ]}
      />
    </Page>
  );
}
