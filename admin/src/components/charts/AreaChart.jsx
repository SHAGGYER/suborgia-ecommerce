import React from "react";
import Chart from "react-apexcharts";
import { ChartCard } from "../ChartCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

export default function AreaChart({
  data,
  categories,
  strokeColor,
  fillColor,
  height,
  title,
  badge,
  number,
  xAxisLabelsShow = false,
  yAxisLabelsShow = false,
  trend = "up",
  type,
}) {
  /*   const options = {
    chart: {
      id: "basic-bar",
      background: "white",
      toolbar: {
        show: false,
      },
      offsetY: -25,
      parentHeightOffset: -200,
    },
    tooltip: {
      theme: "dark",
    },
    stroke: {
      curve: "smooth",
      width: 7,
      colors: [strokeColor],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        show: xAxisLabelsShow,
      },
    },
    yaxis: {
      show: yAxisLabelsShow,
    },
    fill: {
      colors: [fillColor],
      type: "solid",
    },
    markers: {
      shape: "circle",
    },
    grid: {
      show: false,
    },
  }; */

  /*   const series = [
    {
      name: "Sales",
      data,
    },
  ]; */

  const body = {
    labels: categories,
    datasets: [
      {
        lineTension: 0.4,
        fill: true,
        label: title,
        data,
        borderColor: strokeColor,
        backgroundColor: fillColor,
      },
    ],
  };

  return (
    <ChartCard>
      <div className="content">
        <div className="header">
          <h3 className="title">{title}</h3>
          <div className="badge">{badge}</div>
        </div>

        <div className="number-container">
          <div className="number">{number}</div>
          <i
            className={"fa-solid fa-arrow-trend-" + trend}
            style={{ color: trend === "up" ? "green" : "red" }}
          />
        </div>
      </div>
      <div className="chart">
        {type === "line" ? (
          <Line data={body} options={options} />
        ) : (
          <Bar data={body} options={options} />
        )}
      </div>
    </ChartCard>
  );
}
