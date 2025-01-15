import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const generateLast12Months = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); 
  const result = [];

  for (let i = 0; i < 12; i++) {
    result.push(months[(currentMonth + i + 1) % 12]);
  }

  return result;
};

const lineChartOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#478CCF", "#4535C1"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: "100%",
    width: "100%",
    type: "line",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: "100%",
          width: "100%",
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: "100%",
          width: "100%",
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "smooth",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#478CCF", "#4535C1"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: generateLast12Months(),
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 10,
  },
};

const extractData = (data, dateField) => {
  const months = generateLast12Months();
  const countByMonth = Array(12).fill(0);

  data?.forEach((item) => {
    const date = new Date(item[dateField]);
    const monthIndex = date.getMonth();
    const currentMonth = new Date().getMonth();
    const adjustedMonthIndex = (monthIndex - currentMonth + 11) % 12;
    countByMonth[adjustedMonthIndex]++;
  });

  return countByMonth;
};

const LineChart = ({ importData, exportData }) => {
  const [series, setSeries] = useState([
    { name: "Import", data: [] },
    { name: "Export", data: [] },
  ]);

  useEffect(() => {
    const importSeries = extractData(importData, "receivedDate");
    const exportSeries = extractData(exportData, "exportDate");

    setSeries([
      { name: "Import", data: importSeries },
      { name: "Export", data: exportSeries },
    ]);
  }, [importData, exportData]);

  return (
    <div className="w-full h-full rounded-sm shadow-default">
      <div id="lineChart" className="-ml-5">
        <ReactApexChart
          options={{ ...lineChartOptions, xaxis: { ...lineChartOptions.xaxis, categories: generateLast12Months() } }}
          series={series}
          type="line"
        />
      </div>
    </div>
  );
};

export default LineChart;
