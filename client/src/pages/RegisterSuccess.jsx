import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";
import Checkmark from "../components/Checkmark";
import Page from "../components/Page";
import queryString from "query-string";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function RegisterSuccess() {
  const query = queryString.parse(window.location.search);

  useEffect(() => {
    let timerId = setTimeout(() => {
      window.location.href = query?.returnUrl ? query.returnUrl : "/";
    }, 5000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  return (
    <Page>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <h1>You have successfully created an account!</h1>
        <h2>We have also logged you in.</h2>
        <h3>Please wait, redirecting...</h3>
        <Checkmark />
      </div>
    </Page>
  );
}
