import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import Breadcrumbs from "../../utils/Breadcumbs";
import useDocumentTitle from "../../utils/UseDocumentTitle";
const { Meta } = Card;

const DataComponent = () => {
  useDocumentTitle('Data')
  const cardData = [
    {
      title: "Warehouse",
      description: "Manage your warehouses.",
      icon: <WarehouseIcon style={{ fontSize: 64 }} />,
      link: "/data/warehouse",
    },
    // {
    //   title: "Zone",
    //   description: "Define zones within warehouses.",
    //   icon: <LocationOnIcon style={{ fontSize: 64 }} />,
    //   link: "/data/zone",
    // },
    {
      title: "Product",
      description: "Manage your products.",
      icon: <StoreIcon style={{ fontSize: 64 }} />,
      link: "/products",
    },
    {
      title: "Category",
      description: "Categorize your products.",
      icon: <CategoryIcon style={{ fontSize: 64 }} />,
      link: "/data/category",
    },
    {
      title: "Customer",
      description: "Manage your customers.",
      icon: <PeopleIcon style={{ fontSize: 64 }} />,
      link: "/data/customer",
    },
  ];

  const cardStyle = {
    width: "80%",
    height: 0,
    paddingBottom: "60%",
    position: "relative",
    overflow: "hidden",
  };

  const cardContentStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  return (
    <div>
      <Breadcrumbs/>
      <div style={{ padding: "10px" }}>
        <Row gutter={[16, 16]} justify="space">
          {cardData.map((card, index) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={index}>
              <Link to={card.link} style={{ display: "block", height: "100%" }}>
                <Card hoverable style={cardStyle}>
                  <div style={cardContentStyle}>
                    {card.icon}
                    <Meta
                      title={
                        <div style={{ textAlign: "center" }}>{card.title}</div>
                      }
                      description={
                        <div style={{ textAlign: "center" }}>
                          {card.description}
                        </div>
                      }
                    />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DataComponent;
