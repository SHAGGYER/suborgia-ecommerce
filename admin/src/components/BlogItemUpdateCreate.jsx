import React from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import Editor from "./Editor";
import FloatingTextField from "./FloatingTextField";
import { PropertyStyled } from "./ProductUpdateCreateDialog";
import SaveButton from "./SaveButton";
import PrimaryButton from "./UI/PrimaryButton";

const BlogItemUpdateCreateStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 3px solid #efefef;
  margin-bottom: 1rem;
  position: relative;

  img {
    width: 300px;
    height: 300px;
    object-fit: cover;
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }
`;

export default function BlogItemUpdateCreate({
  row,
  onUpdated,
  onCreated,
  onDeleted,
  onClose,
}) {
  const [title, setTitle] = React.useState(row?.title || "");
  const [content, setContent] = React.useState(row?.content || "");
  const [image, setImage] = React.useState(row?.image || "");
  const [imageFile, setImageFile] = React.useState(null);
  const [tags, setTags] = React.useState(
    row?.tags ? JSON.parse(row?.tags) : []
  );
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const removeField = (e, fieldIndex) => {
    e.stopPropagation();
    const newTags = [...tags];
    newTags.splice(fieldIndex, 1);
    setTags(newTags);
  };

  const handleAddField = (e) => {
    e.preventDefault();
    const newTags = [...new Set([...tags, newTag])];
    setTags(newTags);
    setNewTag("");
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (row?.id) {
        const { data } = await HttpClient().post(
          `/api/blog/${row.id}`,
          formData
        );
        onUpdated(data.content);
        onClose();
      } else {
        const { data } = await HttpClient().post("/api/blog", formData);
        onCreated(data.content);
        onClose();
      }
    } catch (error) {
      setError(error?.response?.data?.errors);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await HttpClient().delete(`/api/blog/${row.id}`);
      onDeleted();
      onClose();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <BlogItemUpdateCreateStyled>
      <h1>{row?.id ? "Update" : "Create"} Blog Item</h1>

      <FloatingTextField
        label="Title"
        value={title}
        error={error?.title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {error?.content && <p className="error">{error.content}</p>}
      <Editor value={content} onChange={setContent} />
      {error?.image && <p className="error">{error.image}</p>}
      <input type="file" onChange={handleFileChange} multiple />
      {image && <img src={image} alt="preview" />}

      <h4>Tags</h4>

      <PropertyStyled>
        <div className="fields">
          {tags.map((tag, index) => (
            <article className="field" key={index}>
              <span>{tag}</span>
              <i
                onClick={(e) => removeField(e, index)}
                className="fa-solid fa-trash-can"
              />
            </article>
          ))}
          <form className="new-field-form" onSubmit={handleAddField}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </form>
        </div>
      </PropertyStyled>

      {!row?.id ? (
        <PrimaryButton onClick={onSubmit} disabled={loading}>
          Create
        </PrimaryButton>
      ) : (
        <SaveButton
          onDelete={onDelete}
          loading={loading}
          onSaveAndClose={() => onSubmit()}
        />
      )}
    </BlogItemUpdateCreateStyled>
  );
}
