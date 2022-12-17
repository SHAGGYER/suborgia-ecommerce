import React from "react";
import styled from "styled-components";
import Page from "../components/Page";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import Autocomplete from "./Autocomplete";

const CreateBannerStyled = styled.div`
  position: relative;
  border-radius: 7px;
  border: 1px solid #ccc;
  padding: 1rem;
  width: 100%;
  max-width: 500px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: start;

  h3 {
    margin-bottom: 1rem;
  }

  img {
    display: block;
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  input.file {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }

  .badge {
    background-color: #464dff;
    color: white;
    padding: 0.5rem;
    border-radius: 7px;
    margin-bottom: 1rem;
  }
`;

export default function CreateBanner() {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [product, setProduct] = React.useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    if (product) {
      formData.append("product_id", product.id);
    }

    await HttpClient().post("/api/banners", formData);

    setFile(null);
    setPreview(null);
  };

  return (
    <Page>
      <CreateBannerStyled>
        <h3>Choose product</h3>
        <Autocomplete
          label="Product"
          url="/api/products"
          prop="name"
          onSelect={(prod) => setProduct(prod)}
        />
        {product && <p className="badge">{product.name}</p>}
        <h3>Upload image</h3>
        <input
          className="file"
          type="file"
          onChange={(event) => {
            {
              handleFileChange(event);
            }
          }}
        />
        {preview && <img src={preview} alt="preview" />}
        <PrimaryButton onClick={uploadFile}>Upload</PrimaryButton>
      </CreateBannerStyled>
    </Page>
  );
}
