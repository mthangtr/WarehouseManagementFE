import React from "react";
import { useSelector } from "react-redux";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../utils/Breadcumbs";
import Loading from '../../utils/Loading';
import WarehouseIcon from "@mui/icons-material/Warehouse";
import useDocumentTitle from "../../utils/UseDocumentTitle";

const { Meta } = Card;

const DataZone = () => {
  useDocumentTitle('Zones')
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const navigate = useNavigate();

  const {
    data: warehouses,
    isLoading: isLoadingWarehouses,
    error: errorWarehouses,
  } = useGetAllWarehousesQuery(authToken);

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

  const handleCardClick = (id) => {
    navigate(`/data/zone/warehouseId/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Breadcrumbs />
      {isLoadingWarehouses ? (
        <Loading />
      ) : (
        <div style={{ padding: "10px" }}>
          <Row gutter={[16, 16]} justify="space-around">
            {warehouses?.data.map((warehouse) => (
              <Col xs={24} sm={24} md={12} lg={8} xl={8} key={warehouse.id}>
                <Card hoverable style={cardStyle} onClick={() => handleCardClick(warehouse.id)}>
                  <div style={cardContentStyle}>
                    <WarehouseIcon style={{ fontSize: 64 }} />
                    <Meta
                      title={<div style={{ textAlign: "center" }}>{warehouse.name}</div>}
                      description={<div style={{ textAlign: "center" }}>{warehouse.description}</div>}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default DataZone;
