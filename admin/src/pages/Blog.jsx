import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import MyResourceBrowser from "../components/MyResourceBrowser";
import BlogItemUpdateCreate from "../components/BlogItemUpdateCreate";

export default function Blog() {
  return (
    <Page>
      <MyResourceBrowser
        title={"Blog"}
        url="/api/blog"
        component={BlogItemUpdateCreate}
        templateColumns="50px 150px 1fr"
        newRow={{
          name: "A new blog item",
          content: "",
          image: null,
        }}
        columns={[
          {
            name: "",
            width: "50px",
            cell: (row) =>
              row?.image ? (
                <img
                  src={row?.image}
                  alt={row?.title}
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              ) : (
                <span />
              ),
          },
          {
            name: "ID",
            key: "id",
          },
          {
            name: "Title",
            key: "title",
          },
        ]}
        order={[
          {
            key: "created_at",
            name: "Created at",
          },
        ]}
        additionalSearch={[
          {
            title: "ID",
            key: "id",
          },
          {
            title: "Title",
            key: "title",
            options: [
              {
                title: "Contains",
                key: "like",
              },
              {
                title: "Equals",
                key: "=",
              },
            ],
          },
        ]}
      />
    </Page>
  );
}
