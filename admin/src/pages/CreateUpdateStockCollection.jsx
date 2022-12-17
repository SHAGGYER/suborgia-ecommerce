import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "../components/UI/PrimaryButton";
import styled from "styled-components";

const CollectionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: flex-start;

  .properties {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .fields {
      display: flex;
      gap: 0.5rem;

      .field {
        background-color: aliceblue;
        padding: 1rem;
        cursor: pointer;

        &.selected {
          background-color: #3f3fc7;
          color: white;
        }
      }
    }
  }

  input {
    padding: 0.5rem;
  }
`;

export default function CreateUpdateStockCollection() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [newCollection, setNewCollection] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (id) {
      getProduct();
      getCollections();
    }
  }, [id]);

  const getProduct = async () => {
    const { data } = await HttpClient().get(`/api/products/${id}`);
    setProduct(data.content);
  };

  const getCollections = async () => {
    const { data } = await HttpClient().get(
      `/api/products/stock-collections/${id}`
    );
    setCollections(data.content);
  };

  const selectPropertyFieldOnCollection = (propertyIndex, fieldIndex) => {
    const collection = { ...newCollection };
    const property = { ...collection.properties[propertyIndex] };

    property.fields.forEach((field) => (field.selected = false));

    const field = { ...property.fields[fieldIndex] };
    field.selected = !field.selected;
    property.fields[fieldIndex] = field;
    collection.properties[propertyIndex] = property;
    setNewCollection(collection);
  };

  const isPropertyFieldSelected = (propertyIndex, fieldIndex) => {
    const collection = { ...newCollection };
    const property = { ...collection.properties[propertyIndex] };
    const field = { ...property.fields[fieldIndex] };
    return field.selected ? true : false;
  };

  const handleStockChange = (value) => {
    const collection = { ...newCollection };
    collection.stock = value;
    setNewCollection(collection);
  };

  const handleSave = async () => {
    const { data } = await HttpClient().post(
      `/api/products/stock-collections`,
      {
        stock: newCollection.stock,
        product_id: product.id,
        items: newCollection.properties.map((property) => {
          const selectedField = property.fields.find((field) => field.selected);
          return {
            field_id: selectedField.id,
          };
        }),
      }
    );
  };

  const updateCollection = async (collection) => {
    await HttpClient().post(
      `/api/products/stock-collections/${collection.id}`,
      {
        stock: collection.stock,
      }
    );
  };

  const handleChangeCollectionStock = (collectionIndex, value) => {
    const newCollections = [...collections];
    const collection = { ...newCollections[collectionIndex] };
    collection.stock = value;
    newCollections[collectionIndex] = collection;
    setCollections(newCollections);
  };

  return (
    <Page>
      <h1>{product?.name}</h1>

      <PrimaryButton
        onClick={() =>
          setNewCollection({ properties: [...product?.properties], stock: "" })
        }
      >
        New Stock Collection
      </PrimaryButton>

      <CollectionsContainer>
        {collections?.map((collection, collectionIndex) => (
          <article className="properties" key={collection.id}>
            <div className="fields">
              {collection.items.map((item) => (
                <div className="field" key={item.id}>
                  {item.field.name}
                </div>
              ))}
              <input
                type={"number"}
                value={collection.stock}
                placeholder="Stock"
                onChange={(e) =>
                  handleChangeCollectionStock(collectionIndex, e.target.value)
                }
              />
              <PrimaryButton onClick={() => updateCollection(collection)}>
                Update
              </PrimaryButton>
            </div>
          </article>
        ))}
      </CollectionsContainer>

      {newCollection && (
        <CollectionsContainer>
          <PrimaryButton>New Property</PrimaryButton>
          <article className="properties">
            {newCollection?.properties?.map((property, propertyIndex) => (
              <div key={property.id}>
                <h3>{property.name}</h3>
                <div className="fields">
                  {property.fields.map((field, fieldIndex) => (
                    <div
                      onClick={() =>
                        selectPropertyFieldOnCollection(
                          propertyIndex,
                          fieldIndex
                        )
                      }
                      className={
                        "field " +
                        (isPropertyFieldSelected(propertyIndex, fieldIndex)
                          ? "selected"
                          : "")
                      }
                      key={field.id}
                    >
                      {field.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </article>
          <input
            type="number"
            value={newCollection?.stock}
            onChange={(e) => handleStockChange(e.target.value)}
            placeholder="Stock"
          />
          <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
        </CollectionsContainer>
      )}
    </Page>
  );
}
