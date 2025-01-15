import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DonutChart = ({  data, title }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (data) {
      const statusCounts = data.data.reduce((acc, exportItem) => {
        acc[exportItem.status] = (acc[exportItem.status] || 0) + 1;
        return acc;
      }, {});

      setSeries(Object.values(statusCounts));
      setLabels(Object.keys(statusCounts));
    }
  }, [data]);

  const options = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#06D001", "#F8D49A", "#8FD0EF", "#EE4E4E", "#FF919D"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "40%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 300,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <div>
        <h5 className="text-xl font-semibold flex  justify-center">{title} status</h5>
      </div>
      <div className="flex  justify-center">
        <Chart options={options} series={series} type="donut" />
      </div>
    </div>
  );
};

export default DonutChart;
