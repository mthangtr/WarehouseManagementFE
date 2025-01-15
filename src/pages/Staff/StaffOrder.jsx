import React from "react";
import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import Breadcrumbs from "../../utils/Breadcumbs";
import { Meta } from "antd/es/list/Item";
import LogoutIcon from '@mui/icons-material/Logout';
import useDocumentTitle from "../../utils/UseDocumentTitle";

const StaffOrder = () => {
  useDocumentTitle('Orders')
  const cardData = [
    {
      title: "Import",
      description: "",
      icon: <LogoutIcon style={{ fontSize: 64, transform: 'rotate(90deg)' }} />,
      link: "/staff/order/import",
    },
    {
      title: "Export",
      description: "",
      icon: <LogoutIcon style={{ fontSize: 64, transform: 'rotate(-90deg)' }} />,
      link: "/staff/order/export",
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
    <div>
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
    </div>
  )
}

export default StaffOrder