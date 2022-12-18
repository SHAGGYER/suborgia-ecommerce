import React, { useEffect } from "react";
import AreaChart from "../components/charts/AreaChart";
import Page from "../components/Page";
import SummaryCard from "../components/SummaryCard";
import HttpClient from "../services/HttpClient";
import Skeleton from "react-loading-skeleton";

export default function Analytics() {
  const [sales, setSales] = React.useState([]);
  const [mostBoughtProducts, setMostBoughtProducts] = React.useState([]);
  const [mostBoughtCategories, setMostBoughtCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getAnalytics();
  }, []);

  const getAnalytics = async () => {
    setLoading(true);
    const { data } = await HttpClient().get("/api/analytics");

    setSales(data.sales);
    setMostBoughtCategories(data.categories);
    setMostBoughtProducts(data.products);
    setLoading(false);
  };

  return (
    <Page>
      <div style={{ display: "flex", gap: "1rem" }}>
        {loading ? (
          <>
            <Skeleton height={250} width={350} />
            <Skeleton height={250} width={350} />
            <Skeleton height={250} width={350} />
          </>
        ) : (
          <>
            <AreaChart
              categories={sales.labels}
              data={sales.values}
              fillColor="#e6d32c"
              height={200}
              strokeColor="orange"
              title={"Top Sales"}
              badge={"Last 7 days"}
              number={`$${sales.total}`}
              trend={sales.trend}
              type="line"
            />
            <AreaChart
              categories={mostBoughtProducts.labels}
              data={mostBoughtProducts.values}
              fillColor="#267397"
              height={200}
              strokeColor="#38BDF8"
              title={"5 Most Bought Products"}
              badge={"Last 7 days"}
              number={"$" + mostBoughtProducts.total}
            />
            <AreaChart
              categories={mostBoughtCategories.labels}
              data={mostBoughtCategories.values}
              fillColor="#973845"
              height={200}
              strokeColor="#FB7185"
              title={"Top 5 Categories"}
              badge={"Last 7 days"}
              number={"$" + mostBoughtCategories.total}
            />
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <SummaryCard
          title={"Total Sales"}
          subtitle={"Testing"}
          number={"$1,500"}
          color={"#e6d32c"}
        />
        <SummaryCard
          title={"Total Orders"}
          subtitle={"Testing"}
          number={"1,500"}
          color={"#25a569"}
        />
        <SummaryCard
          title={"Total Products"}
          subtitle={"Testing"}
          number={"1,500"}
          color={"#fb6579"}
        />
        <SummaryCard
          title={"Total Categories"}
          subtitle={"Testing"}
          number={"1,500"}
          color={"#47c0f8"}
        />
      </div>
    </Page>
  );
}
