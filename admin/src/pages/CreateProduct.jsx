import React from "react";
import { Container } from "../components/Container";
import Page from "../components/Page";
import { ProductUpdateCreateDialog } from "../components/ProductUpdateCreateDialog";

export default function CreateProduct() {
  return (
    <Page>
      <Container>
        <ProductUpdateCreateDialog />
      </Container>
    </Page>
  );
}
