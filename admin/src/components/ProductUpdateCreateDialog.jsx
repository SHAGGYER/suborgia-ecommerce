import React, { useRef, useState } from "react";
import FloatingTextField from "../components/FloatingTextField";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "../components/UI/Form";
import { DialogStyled } from "../components/UI/DialogStyled";
import ResourceBrowser from "../components/ResourceBrowser";
import { CustomDialog, useDialog } from "react-st-modal";
import PrimaryButton from "./UI/PrimaryButton";
import JoditEditor from "jodit-react";

const FieldDialog = ({ field }) => {
  const [usedField, setUsedField] = useState(field);
  const dialog = useDialog();

  const handleUpdate = () => {
    dialog.close(usedField);
  };

  const handlePropUpdate = (prop, value) => {
    setUsedField({ ...usedField, [prop]: value });
  };

  return (
    <DialogStyled>
      <h1>Field "{field?.name}"</h1>
      <FloatingTextField
        label="Name"
        value={usedField.name}
        onChange={(e) => handlePropUpdate("name", e.target.value)}
      />

      <FloatingTextField
        label="Stock"
        value={usedField.stock}
        onChange={(e) => handlePropUpdate("stock", e.target.value)}
      />

      <Form.Select
        label="Type"
        value={usedField.type}
        onChange={(e) => handlePropUpdate("type", e.target.value)}
      >
        <option value="">None</option>
        <option value="additive">Additive</option>
        <option value="subtractive">Subtractive</option>
      </Form.Select>

      {usedField.type !== "" && (
        <FloatingTextField
          label="Value"
          onChange={(e) => handlePropUpdate("adjusted_price", e.target.value)}
          value={usedField.adjusted_price}
          type="number"
        />
      )}
      <PrimaryButton onClick={() => handleUpdate()}>Update</PrimaryButton>
    </DialogStyled>
  );
};

const CategoryDialog = () => {
  const dialog = useDialog();

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
  ];

  return (
    <DialogStyled>
      <h1>Category</h1>
      <ResourceBrowser
        url="/api/categories"
        onSelect={(category) => dialog.close(category)}
        columns={columns}
      />
    </DialogStyled>
  );
};

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  padding: 0.25rem;

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .property-name {
    font-weight: bold;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;

    i {
      cursor: pointer;
    }
  }
`;

const PropertyStyled = styled.div`
  border: 1px solid black;

  .fields {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;

    .field {
      cursor: pointer;
      padding: 0.5rem;
      background-color: aliceblue;
      gap: 0.5rem;
      align-items: center;
      display: flex;

      span {
        word-break: break-all;
      }

      i {
        font-size: small;
      }
    }
  }

  .new-field-form {
    flex: 1;
    input {
      width: 100%;
      border: none;
      padding: 1rem;
      outline: none;
    }
  }
`;

const CreateDialogStyled = styled.div`
  width: 100%;
  .content {
    width: 100%;
    display: grid;
    grid-template-columns: 230px 1fr 1fr;
    align-items: start;
    gap: 1rem;
  }

  padding: 1rem;

  article {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .image-container {
    width: 100%;

    .controls {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      gap: 1rem;

      i {
        cursor: pointer;
      }
    }

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      object-position: center;
    }
  }
`;

export const ProductUpdateCreateDialog = ({ product, onCreated }) => {
  const dialog = useDialog();

  const [name, setName] = React.useState(product ? product.name : "");
  const [description, setDescription] = React.useState(
    product ? product.description : ""
  );
  const [longDescription, setLongDescription] = React.useState(
    product ? product.long_description : ""
  );
  const [price, setPrice] = React.useState(product ? product.price : "");
  const [stock, setStock] = React.useState(product ? product.stock : "");
  const [images, setImages] = React.useState(product ? product.images : []);
  const [properties, setProperties] = React.useState(
    product ? product.properties : []
  );
  const [newProperty, setNewProperty] = React.useState("");
  const [newFields, setNewFields] = React.useState([]);
  const [category, setCategory] = useState(product ? product.category : null);

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const editor = useRef();

  const config = React.useMemo(
    () => ({
      readonly: false,
      spellcheck: false,
      minHeight: 300,
      toolbarButtonSize: "medium",
      showCharsCounter: false,
      showPlaceholder: false,
      showXPathInStatusbar: false,
      disablePlugins: "clean-html, paste",
      removeButtons: [
        "fullsize",
        "undo",
        "redo",
        "copyformat",
        "strikethrough",
        "eraser",
      ],
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "paragraph",
        "fontsize",
        "font",
        "|",
        "ul",
        "ol",
        "|",
        "indent",
        "outdent",
        "|",
        "left",
        "center",
        "right",
        "|",
        "link",
        "image",
        "hr",
      ],
    }),
    []
  );

  const onChangeNewField = (value, propertyIndex) => {
    const newNewFields = [...newFields];
    newNewFields[propertyIndex] = value;
    setNewFields(newNewFields);
  };

  const handleFileChange = (e) => {
    setImages(Array.prototype.slice.call(e.target.files));
  };

  const handleAddField = (e, propertyIndex) => {
    e.preventDefault();
    const newProperties = [...properties];
    newProperties[propertyIndex].fields.push({
      name: newFields[propertyIndex],
      type: "",
      adjusted_price: 0,
      stock: "",
    });
    setProperties(newProperties);
    onChangeNewField("", propertyIndex);
  };

  const addProperty = (e) => {
    e.preventDefault();
    setProperties([
      ...properties,
      {
        name: newProperty,
        fields: [],
      },
    ]);
    setNewProperty("");
  };

  const openFieldDialog = async (field, index, propertyIndex) => {
    const result = await CustomDialog(
      <FieldDialog field={field} index={index} />
    );

    if (result) {
      const newProperties = [...properties];
      newProperties[propertyIndex].fields[index] = result;
      setProperties(newProperties);
    }
  };

  const removeField = (e, fieldIndex, propertyIndex) => {
    e.stopPropagation();
    const newProperties = [...properties];
    newProperties[propertyIndex].fields.splice(fieldIndex, 1);
    setProperties(newProperties);
  };

  const removeProperty = (e, propertyIndex) => {
    e.stopPropagation();
    const newProperties = [...properties];
    newProperties.splice(propertyIndex, 1);
    setProperties(newProperties);
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    for (let image of images) {
      formData.append("images[]", image);
    }
    formData.append("category_id", category.id);
    formData.append("long_description", longDescription);
    formData.append("properties", JSON.stringify(properties));

    if (product) {
      await HttpClient().post(`/api/products/${product.id}`, formData);
      dialog.close(true);
    } else {
      await HttpClient().post("/api/products", formData);
      if (onCreated) {
        onCreated();
      } else {
        window.location = "/products";
      }
    }
  };

  return (
    <CreateDialogStyled>
      <section className="content">
        <article>
          <div className="image-container">
            {images.length > 0 && (
              <img
                src={
                  product
                    ? images[currentImageIndex].file_path
                    : URL.createObjectURL(images[currentImageIndex])
                }
                alt="product"
              />
            )}
            <div className="controls">
              <i
                className="fa-solid fa-angle-left"
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === 0 ? 0 : currentImageIndex - 1
                  )
                }
              />
              <span>
                {currentImageIndex + 1} of {images.length}
              </span>
              <i
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === images.length - 1
                      ? images.length - 1
                      : currentImageIndex + 1
                  )
                }
                className="fa-solid fa-angle-right"
              />
            </div>
          </div>
          <input type="file" onChange={handleFileChange} multiple />
        </article>
        <article>
          <div>
            {category && (
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <span>Category: {category.name}</span>
                <i
                  style={{ cursor: "pointer" }}
                  onClick={() => setCategory(null)}
                  className="fa-solid fa-trash-can"
                />
              </div>
            )}

            <PrimaryButton
              onClick={async () => {
                const result = await CustomDialog(<CategoryDialog />);
                if (result) {
                  setCategory(result);
                }
              }}
            >
              Select Category
            </PrimaryButton>
          </div>
          <FloatingTextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FloatingTextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <FloatingTextField
              label="Price"
              value={price}
              prependText="$"
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />
            <FloatingTextField
              label="Stock"
              value={stock}
              type="number"
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div style={{ width: "100%" }}>
            <JoditEditor
              ref={editor}
              value={longDescription}
              tabIndex={1}
              config={config}
              onBlur={(newContent) => setLongDescription(newContent)} // preferred to use only this option to update the body for performance reasons
              onChange={(newContent) => {}}
            />
          </div>
        </article>
        <article>
          <form
            onSubmit={addProperty}
            style={{ display: "flex", width: "100%", gap: "0.5rem" }}
          >
            <FloatingTextField
              label="New Property"
              value={newProperty}
              onChange={(e) => setNewProperty(e.target.value)}
            />
            <PrimaryButton>Add</PrimaryButton>
          </form>
          <PropertyContainer>
            {properties.map((property, propertyIndex) => (
              <section key={propertyIndex}>
                <h3 className="property-name">
                  <span>{property.name}</span>
                  <i
                    className="fa-solid fa-trash-can"
                    onClick={(e) => removeProperty(e, propertyIndex)}
                  />
                </h3>
                <PropertyStyled key={propertyIndex}>
                  <div className="fields">
                    {property.fields.map((field, index) => (
                      <article
                        onClick={() =>
                          openFieldDialog(field, index, propertyIndex)
                        }
                        className="field"
                        key={index}
                      >
                        <span>{field.name}</span>
                        <i
                          onClick={(e) => removeField(e, index, propertyIndex)}
                          className="fa-solid fa-trash-can"
                        />
                      </article>
                    ))}
                    <form
                      className="new-field-form"
                      onSubmit={(e) => handleAddField(e, propertyIndex)}
                    >
                      <input
                        type="text"
                        value={newFields[propertyIndex] || ""}
                        onChange={(e) =>
                          onChangeNewField(e.target.value, propertyIndex)
                        }
                      />
                    </form>
                  </div>
                </PropertyStyled>
              </section>
            ))}
          </PropertyContainer>
        </article>

        {/*      <div className="image-container">
        {images.map((image, index) => (
          <img
            src={
              product
                ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                    image.file_path
                  }`
                : URL.createObjectURL(image)
            }
            key={index}
          />
        ))}
      </div> */}
      </section>

      <PrimaryButton onClick={onSubmit}>Add</PrimaryButton>
    </CreateDialogStyled>
  );
};
