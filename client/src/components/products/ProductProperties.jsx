import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

const ProductPropertiesStyled = styled.div`
  .property {
    margin-bottom: 2rem;

    h3 {
      font-size: 20px;
      margin-bottom: 1rem;
    }
    .fields {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .field {
      border: 2px solid #efefef;
      padding: 1rem;
    }
  }
`;

export default function ProductProperties({
  properties,
  onChange,
  stockCollections,
  getOutOfStock,
}) {
  const [selectedProperities, setSelectedProperities] = React.useState({});

  useEffect(() => {
    selectDefaultPropertyFields();
  }, []);

  React.useEffect(() => {
    onChange({
      properties: selectedProperities,
      stockCollection: getStockCollection(),
    });
    getOutOfStock(isOutOfStock());
  }, [selectedProperities]);

  const handleSelectPropertyField = (property, value) => {
    setSelectedProperities((prev) => {
      return {
        ...prev,
        [property.id]: value,
      };
    });
  };

  const selectDefaultPropertyFields = () => {
    properties?.forEach((property) => {
      if (property.fields.length > 0) {
        handleSelectPropertyField(property, property.fields[0].name);
      }
    });
  };

  const isSelectedPropertyField = (property, value) => {
    return selectedProperities[property.id] === value;
  };

  const getStocks = () => {
    return [...stockCollections].map((stockCollection) => {
      return {
        stock: stockCollection.stock,
        collectionId: stockCollection.id,
        items: Object.values(
          stockCollection.items.map((item) => {
            return item.field.name;
          })
        ),
      };
    });
  };

  const getStockCollection = () => {
    const selectedPropertiesKeys = Object.values(selectedProperities);

    const stocks = getStocks();
    const stockCollection = stocks.find((field) => {
      return (
        isArrayEqual(field.items, selectedPropertiesKeys) && field.stock !== 0
      );
    });

    return stockCollection;
  };

  const isStockCollectionAvailable = (fieldName) => {
    const selectedPropertiesKeys = Object.values(selectedProperities);

    let available = true;
    const stocks = getStocks();
    stocks.forEach((field) => {
      const items = [...field.items];
      const newSelectedPropertiesKeys = [...selectedPropertiesKeys];
      items.forEach(() => {
        newSelectedPropertiesKeys.shift();
        items.shift();
      });

      if (
        newSelectedPropertiesKeys.includes(fieldName) &&
        isArrayEqual(field.items, selectedPropertiesKeys) &&
        isArrayEqual(items, newSelectedPropertiesKeys) &&
        field.stock <= 0
      ) {
        available = false;
      }
    });

    return available;
  };

  const isOutOfStock = () => {
    const selectedProperitiesKeys = Object.values(selectedProperities);
    let available = true;
    const stocks = getStocks();
    stocks.forEach((field) => {
      if (
        isArrayEqual(field.items, selectedProperitiesKeys) &&
        field.stock <= 0
      ) {
        available = false;
      }
    });

    properties?.forEach((property) => {
      property.fields?.forEach((field) => {
        if (
          selectedProperitiesKeys.includes(field.name) &&
          field.stock !== null &&
          field.stock <= 0
        ) {
          available = false;
        }
      });
    });

    return !available;
  };

  const isArrayEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const getFieldAdjustedPrice = (field) => {
    if (field.type === "") {
      return "";
    }

    if (field.type === "additive") {
      return ` (+$${field.adjusted_price})`;
    }

    if (field.type === "subtractive") {
      return ` (-$${field.adjusted_price})`;
    }
  };

  return (
    <ProductPropertiesStyled>
      {properties?.map((property) => (
        <div className="property" key={property.id}>
          <article>
            <h3>{property.name}</h3>
            <div className="fields">
              {property.fields?.map((field) => (
                <div
                  key={field.id}
                  className="field"
                  style={{
                    backgroundColor: isSelectedPropertyField(
                      property,
                      field.name
                    )
                      ? "#f0f0f0"
                      : "transparent",
                  }}
                  onClick={() =>
                    handleSelectPropertyField(property, field.name)
                  }
                >
                  <span>
                    {field.name}
                    {getFieldAdjustedPrice(field)}
                    {(field.stock === null || field.stock > 0) &&
                    isStockCollectionAvailable(field.name)
                      ? ""
                      : " (Out of stock)"}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      ))}
    </ProductPropertiesStyled>
  );
}
