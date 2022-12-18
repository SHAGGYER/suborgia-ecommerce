import React from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import Autocomplete from "./Autocomplete";
import FloatingTextField from "./FloatingTextField";
import SaveButton from "./SaveButton";
import PrimaryButton from "./UI/PrimaryButton";

const UpdateCreateStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
`;

export const BrandUpdateCreateDialog = ({
  row,
  onUpdated,
  onCreated,
  onDeleted,
  onClose,
}) => {
  const [name, setName] = React.useState(row ? row.name : "");
  const [category, setCategory] = React.useState(row ? row.category : null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e, close = false) => {
    e?.preventDefault();

    setError(null);

    if (!name) {
      return;
    }

    const body = {
      name,
    };

    if (category) {
      body.category = category.id;
    }

    try {
      setLoading(true);
      if (!row?.id) {
        const { data } = await HttpClient().post("/api/brands", body);

        onCreated && onCreated(data.content);
        close && onClose();
      } else {
        const { data } = await HttpClient().put(`/api/brands/${row.id}`, body);

        onUpdated && onUpdated(data.content);
        close && onClose();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.errors);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await HttpClient().delete(`/api/brands/${row.id}`);
      setLoading(false);
      onDeleted && onDeleted();
      onClose();
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <UpdateCreateStyled onSubmit={onSubmit}>
      <h1>{row?.id ? "Update" : "Create"} Brand</h1>
      <div style={{ width: "100%" }}>
        {category ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div>{category?.name}</div>
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-trash"
              onClick={() => setCategory(null)}
            ></i>
          </div>
        ) : (
          <Autocomplete
            label="Category"
            onSelect={(category) => setCategory(category)}
            prop="name"
            url="/api/categories"
            error={error?.category}
          />
        )}
      </div>
      <FloatingTextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {row ? (
        <SaveButton
          loading={loading}
          onSaveAndClose={() => onSubmit(null, true)}
          onDelete={onDelete}
        />
      ) : (
        <PrimaryButton type="submit">Create</PrimaryButton>
      )}
    </UpdateCreateStyled>
  );
};
