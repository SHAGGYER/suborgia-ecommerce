import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import MyResourceBrowser from "../components/MyResourceBrowser";
import UserUpdateCreate from "../components/UserUpdateCreate";

export default function Users() {
  return (
    <Page>
      <MyResourceBrowser
        title={"Users"}
        url="/api/users"
        component={UserUpdateCreate}
        templateColumns="50px 300px 300px 1fr"
        newRow={{
          name: "New User",
          email: "",
          role: "user",
        }}
        additionalSearch={[
          {
            key: "name",
            title: "Name",
            options: [
              {
                key: "like",
                title: "Contains",
              },
              {
                key: "=",
                title: "Equals",
              },
            ],
          },
          {
            key: "email",
            title: "Email",
            options: [
              {
                key: "like",
                title: "Contains",
              },
              {
                key: "=",
                title: "Equals",
              },
            ],
          },
          {
            key: "role",
            title: "Role",
            valueType: "select",
            options: [
              {
                key: "user",
                name: "User",
              },
              {
                key: "admin",
                name: "Admin",
              },
            ],
          },
        ]}
        columns={[
          { name: "ID", key: "id" },
          { name: "Name", key: "name" },
          { name: "Email", key: "email" },
          { name: "Role", key: "role" },
        ]}
      />
    </Page>
  );
}
