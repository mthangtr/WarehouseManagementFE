import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../redux/api/usersApiSlice";

const BarChart = () => {
  const [options, setOptions] = useState({
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [], // To be updated with warehouse IDs
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  });

  const [state, setState] = useState({
    series: [
      {
        name: "Staff",
        data: [],
      },
      {
        name: "Admin",
        data: [],
      },
    ],
  });

  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const { data: users, isLoading, error } = useGetAllUsersQuery(authToken);

  useEffect(() => {
    if (users) {
      const warehouseData = {};

      // Group users by warehouse and count the number of admins and staff
      users.data.forEach((user) => {
        const warehouseId = user.warehouse.id;
        if (!warehouseData[warehouseId]) {
          warehouseData[warehouseId] = { admin: 0, staff: 0 };
        }
        if (user.role === "ADMIN") {
          warehouseData[warehouseId].admin += 1;
        } else if (user.role === "STAFF") {
          warehouseData[warehouseId].staff += 1;
        }
      });

      // Prepare data for the chart
      const warehouseIds = Object.keys(warehouseData);
      const staffCounts = warehouseIds.map((id) => warehouseData[id].staff);
      const adminCounts = warehouseIds.map((id) => warehouseData[id].admin);

      setState({
        series: [
          {
            name: "Staff",
            data: staffCounts,
          },
          {
            name: "Admin",
            data: adminCounts,
          },
        ],
      });

      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: warehouseIds,
        },
      }));
    }
  }, [users]);

  return (
    <div className="w-full h-full rounded-sm shadow-default">
      <div className="mb-4 justify-between gap-4"></div>
      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            // height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;