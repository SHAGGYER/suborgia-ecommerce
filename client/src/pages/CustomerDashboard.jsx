import React, { useEffect, useState } from "react";
import HttpClient from "../services/HttpClient";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Page from "../components/Page";
import Title from "../components/Title";
import Filter from "../components/products/Filter";

const FilterStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;

  h3 {
    font-size: 20px;
    margin-bottom: 1rem;
  }
`;

const MenuStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 3px solid #efefef;
`;

const Wrapper = styled.article`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }
`;

function CustomerDashboard(props) {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (search) {
      const id = setTimeout(() => {
        searchHandler();
      }, 500);

      return () => clearTimeout(id);
    }
  }, [search]);

  const searchHandler = async () => {
    const { data } = await HttpClient().post("/api/shop/search", { search });
    setSearchResults(data.results);
  };

  return (
    <Page>
      <Wrapper>
        <MenuStyled>
          <FilterStyled>
            <h3>Categories</h3>
            <Filter title="Electronics" />
            <Filter title="Clothes" />
          </FilterStyled>
          <FilterStyled>
            <h3>Brands</h3>
            <Filter title="Apple" />
            <Filter title="Samsung" />
            <Filter title="Nike" />
            <Filter title="Adidas" />
          </FilterStyled>
        </MenuStyled>
      </Wrapper>
    </Page>
  );
}

export default CustomerDashboard;
