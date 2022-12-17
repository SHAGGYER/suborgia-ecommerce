import React, { useEffect, useState } from "react";
import HttpClient from "../services/HttpClient";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Page from "../components/Page";
import Filter from "../components/products/Filter";
import Product from "../components/products/Product";
import BestSellers from "../components/products/BestSellers";
import PriceFilter from "../components/products/PriceFilter";
import Featured from "../components/products/Featured";
import Banner from "../components/products/Banner";
import Slider from "../components/Slider";
import Skeleton from "react-loading-skeleton";
import { Wrapper } from "../components/Wrapper";

const ContentStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  height: min-content;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

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

  .loading {
    width: 100%;
  }
`;

const MenuStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  height: min-content;
  width: 100%;
  border: 3px solid #efefef;
  margin-bottom: 1rem;
`;

const DashboardWrapper = styled.article`
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

function CustomerDashboard(props) {
  const history = useHistory();
  const { categoryTitle, brand } = useParams();
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (categoryTitle) {
      setCurrentCategory(categoryTitle);
    }
  }, [categoryTitle]);

  useEffect(() => {
    if (brand) {
      setCurrentBrand(brand);
    }
  }, [brand]);

  useEffect(() => {
    getProducts({ brand, category: categoryTitle, brands, categories });

    getCategories();
    getRandomBanners();
  }, []);

  const getCategories = async () => {
    setCategoriesLoading(true);
    const { data } = await HttpClient().get("/api/filters/categories");
    setCategories(data);
    setCategoriesLoading(false);

    if (brand) {
      setCurrentBrand(brand);
      onBrandClick({ brand, category: categoryTitle, categories: data });
    } else {
      onCategoryClick({ category: categoryTitle, categories: data });
    }
  };

  const getProducts = async ({ brand, category, brands, categories }) => {
    const brandObj = getBrandByName(brand, brands);
    const categoryObj = getCategoryByName(category, categories);

    let query = "";

    if (brandObj) {
      query += "?brand=" + brandObj?.id;
    } else if (categoryObj) {
      query += "?category=" + categoryObj?.id;
    }

    setCurrentQuery(query);

    setProductsLoading(true);
    const { data } = await HttpClient().get("/api/filters/products" + query);
    setProducts(data.data);
    setProductsLoading(false);
  };

  const isCurrentCategory = (category) => {
    return categoryTitle === category;
  };

  const isCurrentBrand = (brand) => {
    return currentBrand === brand;
  };

  const getCategoryByName = (name, categories) => {
    return categories.find((category) => category.name === name);
  };

  const getBrandByName = (name, brands) => {
    return brands.find((brand) => brand.name === name);
  };

  const onCategoryClick = async ({ category, brand, categories }) => {
    setCurrentCategory(category);

    const categoryObj = getCategoryByName(category, categories);
    if (categoryObj) {
      const brands = categoryObj.brands;
      setBrands(brands);
      await getProducts({ category: categoryObj.name, brands, categories });
    }

    if (brand) {
      setCurrentBrand(brand);
    }
  };

  const onBrandClick = async ({ brand, category, categories }) => {
    const categoryObj = getCategoryByName(category, categories);
    if (categoryObj) {
      const brands = categoryObj.brands;
      setBrands(brands);
      await getProducts({ brand, brands, categories });
    }

    setCurrentBrand(brand);
    setCurrentCategory(category);
  };

  const onPriceFilter = async ({ min, max }) => {
    const { data } = await HttpClient().get(
      `/api/filters/products${currentQuery}&min=${min}&max=${max}`
    );
    setProducts(data);
  };

  const getRandomBanners = async () => {
    const { data } = await HttpClient().get("/api/banners/random?count=2");
    setBanners(data.content);
  };

  return (
    <Page>
      <Wrapper>
        <Slider
          height={400}
          items={[
            <img
              src={`http://via.placeholder.com/728x400`}
              alt="banner"
              style={{ width: "100%", height: "100%" }}
            />,
            <img
              src={`http://via.placeholder.com/728x400`}
              alt="banner"
              style={{ width: "100%", height: "100%" }}
            />,
            <img
              src={`http://via.placeholder.com/728x400`}
              alt="banner"
              style={{ width: "100%", height: "100%" }}
            />,
          ]}
        />
        <DashboardWrapper>
          <article>
            <MenuStyled>
              <FilterStyled>
                <h3>Categories</h3>
                {categoriesLoading && (
                  <article className="loading" style={{ width: "100%" }}>
                    {Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} width={"100%"} height={50} />
                      ))}
                  </article>
                )}
                {categories.map((category, index) => (
                  <Filter
                    key={index}
                    title={category.name}
                    category={category.name}
                    filter="categories"
                    checked={isCurrentCategory(category.name)}
                    onClick={() =>
                      onCategoryClick({ category: category.name, categories })
                    }
                  />
                ))}
              </FilterStyled>
              <FilterStyled>
                <h3>Brands</h3>
                {categoriesLoading && (
                  <article className="loading" style={{ width: "100%" }}>
                    {Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} width={"100%"} height={50} />
                      ))}
                  </article>
                )}

                {brands.map((brand, index) => (
                  <Filter
                    key={index}
                    title={brand.name}
                    brand={brand.name}
                    category={currentCategory}
                    checked={isCurrentBrand(brand.name)}
                    onClick={() =>
                      onBrandClick({
                        brand: brand.name,
                        category: currentCategory,
                        categories,
                      })
                    }
                  />
                ))}
              </FilterStyled>
            </MenuStyled>
            <PriceFilter onApply={onPriceFilter} />
            <BestSellers />
          </article>
          <div>
            {productsLoading ? (
              <ContentStyled>
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Product key={index} loading={true} />
                  ))}
              </ContentStyled>
            ) : (
              <ContentStyled>
                {products.map((product, index) => (
                  <Product key={index} product={product} />
                ))}
              </ContentStyled>
            )}
          </div>
        </DashboardWrapper>

        {/* Banners */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {banners.map((banner, index) => (
            <Banner
              onClick={() =>
                banner.product_id
                  ? history.push(`/products/${banner.product_id}`)
                  : null
              }
              key={index}
              image={`${banner.file_path}`}
            />
          ))}
        </div>

        {/* Featured */}
        <Featured />
      </Wrapper>
    </Page>
  );
}

export default CustomerDashboard;
