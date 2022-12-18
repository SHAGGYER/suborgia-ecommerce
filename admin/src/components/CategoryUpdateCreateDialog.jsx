import React from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import FloatingTextField from "./FloatingTextField";
import SaveButton from "./SaveButton";
import PrimaryButton from "./UI/PrimaryButton";
import cogoToast from "cogo-toast";

const CategoryUpdateCreateStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
`;

export const CategoryUpdateCreateDialog = ({
  row,
  onUpdated,
  onCreated,
  onDeleted,
  onClose,
}) => {
  const [name, setName] = React.useState(row ? row.name : "");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e, close = false) => {
    e?.preventDefault();

    if (!name) {
      return;
    }

    setLoading(true);
    if (row?.id) {
      await HttpClient().put(`/api/categories/${row.id}`, {
        name,
      });

      onUpdated && onUpdated({ ...row, name });
    } else {
      const { data } = await HttpClient().post("/api/categories", {
        name,
      });

      onCreated && onCreated(data.content);
    }
    setLoading(false);

    setName("");
    close && onClose();
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await HttpClient().delete(`/api/categories/${row.id}`);
      setLoading(false);
      onDeleted && onDeleted();
      onClose();
    } catch (e) {
      setLoading(false);
      cogoToast.error(e?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <CategoryUpdateCreateStyled onSubmit={onSubmit}>
      <h1>{row ? "Update" : "Create"} Category</h1>
      <FloatingTextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {!row ? (
        <PrimaryButton loading={loading} onClick={() => dialog.close(name)}>
          {row ? "Save" : "Create"}
        </PrimaryButton>
      ) : (
        <SaveButton
          loading={loading}
          onDelete={onDelete}
          onSaveAndClose={() => onSubmit(null, true)}
        />
      )}
    </CategoryUpdateCreateStyled>
  );
};
