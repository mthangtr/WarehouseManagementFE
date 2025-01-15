import React from "react";
import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import Breadcrumbs from "../../utils/Breadcumbs";
const { Meta } = Card;

const StaffData = () => {
  const cardData = [
    {
      title: "Zone",
      description: "Define zones within warehouses.",
      icon: <LocationOnIcon style={{ fontSize: 64 }} />,
      link: "/staff/data/zone",
    },
    {
      title: "Product",
      description: "Manage your products.",
      icon: <StoreIcon style={{ fontSize: 64 }} />,
      link: "/staff/data/products",
    },
    {
      title: "Customer",
      description: "Manage your customers.",
      icon: <PeopleIcon style={{ fontSize: 64 }} />,
      link: "/staff/data/customers",
    },
  ];

  const cardStyle = {
    width: "100%",
    height: 0,
    paddingBottom: "100%",
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
    <>
      <Breadcrumbs />
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]} justify="space-around">
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
    </>
  );
};

export default StaffData;
