import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useResourceBrowser } from "../hooks/UseResourceBrowser";
import { Container } from "./Container";
import FloatingTextField from "./FloatingTextField";
import { Pagination } from "./Pagination";
import PrimaryButton from "./UI/PrimaryButton";

const EditRow = styled.div`
  position: relative;
  width: 100%;
  background-color: white;
  z-index: 99;
  box-shadow: 0 10px 5px 0 rgba(0, 0, 0, 0.1);
`;

const RowsContainer = styled.div`
  display: grid;
  padding: 1rem;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;

  div {
  }

  &.header {
    background-color: #f8fafc;
    text-align: left;
  }

  .image {
    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const PER_PAGE = 15;

export default function MyResourceBrowser({
  title,
  url,
  columns,
  component: Component,
  templateColumns,
  newRow,
  noCreate,
  additionalSearch,
  order,
}) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [usedAdditionalSearch, setUsedAdditionalSearch] = useState(
    additionalSearch || []
  );
  const [defaultAdditionalSearch, setDefaultAdditionalSearch] = useState(
    additionalSearch || []
  );
  const [filters, setFilters] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(null);

  const {
    rows,
    setRows,
    totalRows,
    page,
    setPage,
    lastPage,
    search,
    setSearch,
    handleRowUpdated,
    handleRowCreated,
    handleRowDeleted,
    setAdditionalQuery,
    noRows,
    resourceLoading,
    resourceLoaded,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    shouldRefetch,
    setShouldRefetch,
    refetch,
  } = useResourceBrowser(url);

  useEffect(() => {
    if (shouldRefetch) {
      setAdditionalQuery(
        usedAdditionalSearch
          .filter((x) => filtersContain(x))
          .filter((x) => x.value && x.operator)
          .map((search) => {
            return {
              key: search.key,
              value: search.value,
              operator: search.operator,
            };
          })
      );
    }
  }, [usedAdditionalSearch, shouldRefetch]);

  const isPreviousPageDisabled = () => {
    return page === 1;
  };

  const isNextPageDisabled = () => {
    return page === lastPage;
  };

  const calculateCurrentMaxRows = () => {
    return page * PER_PAGE > totalRows ? totalRows : page * PER_PAGE;
  };

  const handleAddNewRow = () => {
    setRows([newRow ? { ...newRow } : undefined, ...rows]);
    setSelectedRowIndex(0);
  };

  const handleAdditionalSearchChange = (title, prop, value) => {
    const newAdditionalSearch = [...defaultAdditionalSearch];
    const index = newAdditionalSearch.findIndex((x) => x.title === title);

    console.log("new", newAdditionalSearch);

    if (
      prop === "operator" &&
      value !== "" &&
      !newAdditionalSearch[index].value
    ) {
      setShouldRefetch(false);
    } else if (prop === "operator" && value === "") {
      newAdditionalSearch[index].value = "";
      setShouldRefetch(true);
    } else if (prop === "value" && !newAdditionalSearch[index].operator) {
      setShouldRefetch(false);
    } else {
      setShouldRefetch(true);
    }

    newAdditionalSearch[index][prop] = value;
    console.log("new", newAdditionalSearch);
    setUsedAdditionalSearch(newAdditionalSearch);
  };

  const handleFilterChange = (e) => {
    setCurrentFilter(e.target.value);
  };

  const handleAddFilter = () => {
    if (currentFilter) {
      console.log(currentFilter);
      const newFilters = [...filters];
      newFilters.push(currentFilter);
      setFilters(newFilters);
    }
  };

  const filtersContain = (search) => {
    return filters.includes(search.title);
  };

  const handleRemoveFilter = async (row, rowIndex) => {
    const newFilters = [...filters];
    const index = newFilters.indexOf(row.title);
    newFilters.splice(index, 1);
    setFilters(newFilters);
    if (row.value && row.operator) {
      handleAdditionalSearchChange(row.title, "value", "");
      handleAdditionalSearchChange(row.title, "operator", "");
      setShouldRefetch(true);
    }
    setCurrentFilter("");
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h1>{title}</h1>
          {!noCreate && (
            <PrimaryButton onClick={handleAddNewRow}>
              <i className="fa-solid fa-plus" />
              <span>New</span>
            </PrimaryButton>
          )}
        </div>

        <div
          style={{
            border: "1px solid #bebebe",
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <select value={currentFilter} onChange={handleFilterChange}>
            <option value="">None</option>
            {defaultAdditionalSearch
              .filter((x) => !filtersContain(x))
              .map((search, index) => (
                <option key={index} value={search.title}>
                  {search.title}
                </option>
              ))}
          </select>
          <PrimaryButton onClick={handleAddFilter}>Add Filter</PrimaryButton>
        </div>

        {additionalSearch && additionalSearch.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {usedAdditionalSearch
              .filter((x) => {
                return filtersContain(x);
              })
              .map((row, rowIndex) => (
                <div
                  key={row.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    border: "1px solid #bebebe",
                    padding: "1rem 1.5rem",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: 2, right: 5 }}>
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa-solid fa-times"
                      onClick={() => handleRemoveFilter(row, rowIndex)}
                    />
                  </div>
                  {row.valueType === "select" ? (
                    <>
                      <label>{row.title}</label>
                      <select
                        value={row.value}
                        onChange={(e) => {
                          handleAdditionalSearchChange(
                            row.title,
                            "operator",
                            "="
                          );
                          handleAdditionalSearchChange(
                            row.title,
                            "value",
                            e.target.value
                          );
                        }}
                      >
                        <option value="">None</option>
                        {row.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <span>{row.title}</span>
                      <select
                        value={row.operator}
                        onChange={(e) =>
                          handleAdditionalSearchChange(
                            row.title,
                            "operator",
                            e.target.value
                          )
                        }
                      >
                        {!row.options ? (
                          <>
                            <option value="">None</option>
                            <option value="like">Contains</option>
                            <option value="=">Equals</option>
                            <option value=">">Greater Than</option>
                            <option value="<">Less Than</option>
                            <option value=">=">Greater Than or Equal</option>
                            <option value="<=">Less Than or Equal</option>
                          </>
                        ) : (
                          <>
                            <option value="">None</option>
                            {row.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option.key}>
                                {option.title}
                              </option>
                            ))}
                          </>
                        )}
                        {/*   <option value="null">Is Empty</option>
                  <option value="not_null">Is Not Empty</option> */}
                      </select>
                      <input
                        value={row.value}
                        onChange={(e) =>
                          handleAdditionalSearchChange(
                            row.title,
                            "value",
                            e.target.value
                          )
                        }
                      />
                    </>
                  )}
                </div>
              ))}
          </div>
        )}

        {order && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
            }}
          >
            <label>Order By</label>
            <select
              value={orderBy}
              onChange={(e) => {
                if (e.target.value !== "") {
                  setShouldRefetch(false);
                } else {
                  setShouldRefetch(true);
                }

                setOrderBy(e.target.value);

                if (e.target.value === "") {
                  setOrderDirection("");
                }
              }}
            >
              <option value="">None</option>
              {order.map((orderItem) => (
                <option key={orderItem.key} value={orderItem.key}>
                  {orderItem.name}
                </option>
              ))}
            </select>
            <select
              value={orderDirection}
              onChange={(e) => {
                setShouldRefetch(true);
                setOrderDirection(e.target.value);
              }}
            >
              <option value="">None</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}

        <RowsContainer
          className={"header"}
          style={{ gridTemplateColumns: `${templateColumns} 50px` }}
        >
          {columns.map((column, columnIndex) => (
            <div key={column.key}>{column.name}</div>
          ))}
          {Component && <div>Details</div>}
        </RowsContainer>
        {resourceLoading && (
          <div style={{ textAlign: "center", padding: "1rem" }}>Loading...</div>
        )}
        {!resourceLoading && resourceLoaded && noRows && (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            No results found
          </div>
        )}
        {!resourceLoading && resourceLoaded && !noRows && (
          <>
            <div style={{ width: "100%" }}>
              {rows.map((row, rowIndex) => (
                <div style={{ position: "relative" }} key={rowIndex}>
                  <RowsContainer
                    style={{ gridTemplateColumns: `${templateColumns} 50px` }}
                  >
                    {row &&
                      columns.map((column, columnIndex) => (
                        <React.Fragment key={column.key}>
                          <div>
                            {column.cell ? column.cell(row) : row[column.key]}
                          </div>
                        </React.Fragment>
                      ))}

                    {!row &&
                      Array(columns.length)
                        .fill(0)
                        .map((_, index) => <div key={index} />)}

                    {Component && (
                      <div>
                        <i
                          className="fa-solid fa-chevron-down"
                          onClick={() => {
                            if (selectedRowIndex === rowIndex) {
                              setSelectedRowIndex(null);
                            } else {
                              setSelectedRowIndex(rowIndex);
                            }
                          }}
                        />
                      </div>
                    )}
                  </RowsContainer>
                  {Component && selectedRowIndex === rowIndex && (
                    <EditRow>
                      <Component
                        row={row || undefined}
                        onUpdated={(row) => handleRowUpdated(rowIndex, row)}
                        onCreated={(row) => handleRowCreated(rowIndex, row)}
                        onClose={() => setSelectedRowIndex(-1)}
                        onDeleted={() => handleRowDeleted(rowIndex)}
                      />
                    </EditRow>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        <Pagination>
          <div className="header">
            {!noRows ? page * PER_PAGE - PER_PAGE + 1 : 0} -{" "}
            {calculateCurrentMaxRows()} of {totalRows}
          </div>
          <div className="controls">
            <i
              className={
                "fa-solid fa-angles-left" +
                (isPreviousPageDisabled() ? " disabled" : "")
              }
              onClick={
                isPreviousPageDisabled()
                  ? null
                  : () => {
                      setPage(1);
                    }
              }
            />
            <i
              className={
                "fa-solid fa-angle-left" +
                (isPreviousPageDisabled() ? " disabled" : "")
              }
              onClick={() =>
                isPreviousPageDisabled() ? null : setPage(page - 1)
              }
            />
            <i
              className={
                "fa-solid fa-angle-right" +
                (isNextPageDisabled() ? " disabled" : "")
              }
              onClick={() => (isNextPageDisabled() ? null : setPage(page + 1))}
            />
            <i
              className={
                "fa-solid fa-angles-right" +
                (isNextPageDisabled() ? " disabled" : "")
              }
              onClick={() => (isNextPageDisabled() ? null : setPage(lastPage))}
            />
          </div>
        </Pagination>
      </div>
    </Container>
  );
}
