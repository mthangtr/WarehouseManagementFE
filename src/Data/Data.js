// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
  UilFile,
  UilExchange,UilImport, UilExport
} from "@iconscout/react-unicons";
import LogoutIcon from "@mui/icons-material/Logout";

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";
// import { keyboard } from "@testing-library/user-event/dist/keyboard";

// Recent Card Imports
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.png";
import img3 from "../assets/images/img3.png";

export const SidebarData = [
  {
    icon: UilEstate,
    heading: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: UilChart,
    heading: "Data",
    link: "/data",
  },
  {
    icon: UilClipboardAlt,
    heading: "Orders",
    link: "/orders",
    subItems: [
      {
        link: "/order/import",
        heading: "Imports",
        icon: UilImport
      },
      {
        link: "/order/export",
        heading: "Exports",
        icon: UilExport
      },
    ],
  },
  {
    icon: UilUsersAlt,
    heading: "Staffs",
    link: "/staffs",
  },
  {
    icon: UilPackage,
    heading: "Products",
    link: "/products",
  },
  {
    icon: UilFile,
    heading: "Reports",
    link: "/report",
  },
];

export const StaffSidebarData = [
  {
    icon: UilEstate,
    heading: "Dashboard",
    link: "/staff/dashboard",
  },
  {
    icon: UilChart,
    heading: "Data",
    link: "/staff/data",
  },
  {
    icon: UilClipboardAlt,
    heading: "Orders",
    link: "/staff/orders",
    subItems: [
      {
        link: "/staff/order/import",
        heading: "Imports",
        icon: UilImport
      },
      {
        link: "/staff/order/export",
        heading: "Exports",
        icon: UilExport
      },
    ],
  },
];
// // Analytics Cards Data
export const cardsData = [
  {
    title: "Sales",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: UilUsdSquare,
    series: [
      {
        name: "Sales",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Revenue",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "14,270",
    png: UilMoneyWithdrawal,
    series: [
      {
        name: "Revenue",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Expenses",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: UilClipboardAlt,
    series: [
      {
        name: "Expenses",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// // Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: "Ngu Duc Tai",
    noti: "all in Spain",
    time: "Leader",
  },
  {
    img: img1,
    name: "Vu Tuan Anh",
    noti: "England is King",
    time: "Frontend developer",
  },
  {
    img: img1,
    name: "Phung Duc Hieu",
    noti: "master all programming languages",
    time: "Backend developer",
  },
  {
    img: img1,
    name: "Truong Manh Thang",
    noti: "is rich",
    time: "Backend developer",
  },
  {
    img: img1,
    name: "Tran Duy Anh",
    noti: "the artist of this Era",
    time: "Business analysis",
  },
];
