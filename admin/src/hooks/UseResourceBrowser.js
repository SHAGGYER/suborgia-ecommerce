import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import HttpClient from "../services/HttpClient";
import cogoToast from "cogo-toast";

export const useResourceBrowser = (url, options = {}) => {
  const { page: pageQuery } = queryString.parse(window.location.search);

  const navigate = useNavigate();
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceLoaded, setResourceLoaded] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [additionalQuery, setAdditionalQuery] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("");
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    let timer;

    if (shouldRefetch) {
      timer = setTimeout(() => {
        getRows(page, search);
        setShouldRefetch(false);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search, orderBy, orderDirection, additionalQuery, shouldRefetch]);

  useEffect(() => {
    navigate(`?page=${page}`);
    setShouldRefetch(true);
  }, [page]);

  const handleRowCreated = (index, row) => {
    const newRows = [...rows];
    newRows[index] = row;
    setRows(newRows);
    cogoToast.success("Row created successfully");
  };

  const handleRowUpdated = (index, row) => {
    const newRows = [...rows];
    newRows[index] = row;
    setRows(newRows);
    cogoToast.success("Row updated successfully");
  };

  const handleRowDeleted = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
    cogoToast.success("Row deleted successfully");
  };

  const getRows = async (page, search = "") => {
    setResourceLoading(true);
    setResourceLoaded(false);
    const { data } = await HttpClient().get(
      `${url}?page=${page}&search=${search}${
        additionalQuery?.length > 0
          ? `&additional_query=${JSON.stringify(additionalQuery)}`
          : ""
      }${orderBy ? `&order_by=${orderBy}` : ""}${
        orderDirection && orderBy ? `&order_direction=${orderDirection}` : ""
      }`
    );
    setRows(data.content.data);
    setTotalRows(data.content.total);
    setLastPage(data.content.last_page);
    setResourceLoading(false);
    setResourceLoaded(true);
  };

  const refetch = async () => {
    await getRows(page, search);
  };

  return {
    rows,
    setRows,
    totalRows,
    page,
    setPage,
    lastPage,
    getRows,
    handleRowUpdated,
    handleRowCreated,
    handleRowDeleted,
    additionalQuery,
    setAdditionalQuery,
    search,
    setSearch,
    noRows: rows.length === 0,
    resourceLoading,
    resourceLoaded,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    shouldRefetch,
    setShouldRefetch,
    refetch,
  };
};
