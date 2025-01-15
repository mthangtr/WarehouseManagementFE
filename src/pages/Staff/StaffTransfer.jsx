import React, { useState, useEffect } from "react";
import { useTransferProductMutation } from "../../redux/api/inventoryApiSlice";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Paper,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { message } from "antd";
import { useGetZoneByWarehouseIdQuery } from "../../redux/api/zoneApiSlice";
import { useGetInventoriesByWarehouseIdQuery } from "../../redux/api/inventoryApiSlice";

const StaffTransfer = ({ initialInventory, authToken, onTransferSuccess }) => {
  const [transfers, setTransfers] = useState([
    {
      productId: initialInventory.product.id,
      fromZoneId: initialInventory.zone.id,
      toZones: [{ toZoneId: "", quantity: "", quantityError: "" }],
      expiredAt: initialInventory.expiredAt,
      quantityError: "",
    },
  ]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  useEffect(() => {
    if (initialInventory?.product?.id && initialInventory?.zone?.id) {
      setIsFormDisabled(false);
    } else {
      setIsFormDisabled(true);
    }
  }, [initialInventory]);

  const {
    data: zones,
    isLoading: isLoadingZones,
    error: errorZones,
  } = useGetZoneByWarehouseIdQuery({
    id: initialInventory?.zone?.warehouse?.id,
    authToken,
  });

  const {
    data: inventories,
    error: inventoriesError,
    isLoading: inventoriesLoading,
  } = useGetInventoriesByWarehouseIdQuery({
    warehouseId: initialInventory?.zone?.warehouse?.id,
    authToken,
  });

  const [transferProduct, { isLoading }] = useTransferProductMutation();

  const handleTransfer = async (e) => {
    e.preventDefault();
    const isValid = transfers.every(
      (transfer) =>
        !transfer.quantityError &&
        transfer.toZones.every((zone) => !zone.quantityError)
    );
    if (!isValid) {
      message.error("Please fix the errors in the form before submitting");
      return;
    }
    try {
      const transferRequests = transfers.flatMap((transfer) =>
        transfer.toZones.map((zone) => ({
          productId: parseInt(transfer.productId, 10),
          fromZoneId: parseInt(transfer.fromZoneId, 10),
          toZoneId: parseInt(zone.toZoneId, 10),
          quantity: parseInt(zone.quantity, 10),
          expiredAt: transfer.expiredAt,
        }))
      );
      const res = await transferProduct({
        transferRequests,
        authToken,
      });
      setTransfers([
        {
          productId: initialInventory.product.id,
          fromZoneId: initialInventory.zone.id,
          toZones: [{ toZoneId: "", quantity: "", quantityError: "" }],
          expiredAt: initialInventory.expiredAt,
          quantityError: "",
        },
      ]);
      // message.success("Transfers successfully");
      message.info(res.error.data)
      onTransferSuccess();
    } catch (err) {
      message.error(res.error.data);
    }
  };

  const handleAddTransfer = () => {
    setTransfers([
      ...transfers,
      {
        productId: "",
        fromZoneId: "",
        toZones: [{ toZoneId: "", quantity: "", quantityError: "" }],
        expiredAt: "",
        quantityError: "",
      },
    ]);
  };

  const handleRemoveTransfer = (index) => {
    const newTransfers = transfers.filter((_, i) => i !== index);
    setTransfers(newTransfers);
  };

  const handleAddZone = (index) => {
    const newTransfers = [...transfers];
    newTransfers[index].toZones.push({
      toZoneId: "",
      quantity: "",
      quantityError: "",
    });
    setTransfers(newTransfers);
  };

  const handleRemoveZone = (index, zoneIndex) => {
    const newTransfers = [...transfers];
    newTransfers[index].toZones = newTransfers[index].toZones.filter(
      (_, i) => i !== zoneIndex
    );
    setTransfers(newTransfers);
  };

  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...transfers];
    newTransfers[index][field] = value;
    setTransfers(newTransfers);
  };

  const handleZoneChange = (index, zoneIndex, field, value) => {
    const newTransfers = [...transfers];
    newTransfers[index].toZones[zoneIndex][field] = value;
    if (field === "quantity") {
      const selectedProductInventories = inventories
        ? inventories.filter(
            (inventory) =>
              inventory.product.id === newTransfers[index].productId &&
              inventory.zone.id === newTransfers[index].fromZoneId &&
              inventory.expiredAt === newTransfers[index].expiredAt
          )
        : [];
      const availableQuantity =
        selectedProductInventories.length > 0
          ? selectedProductInventories[0].quantity
          : 0;
      if (value <= 0 || value > availableQuantity) {
        newTransfers[index].toZones[zoneIndex].quantityError = `Quantity must be greater than 0 and less than or equal to ${availableQuantity}`;
      } else {
        newTransfers[index].toZones[zoneIndex].quantityError = "";
      }
    }
    setTransfers(newTransfers);
  };

  const uniqueProducts = inventories
    ? Array.from(
        new Set(inventories.map((inventory) => inventory.product.id))
      ).map(
        (productId) =>
          inventories.find((inventory) => inventory.product.id === productId)
            .product
      )
    : [];

  const uniqueZones = (productInventories) =>
    Array.from(
      new Set(productInventories.map((inventory) => inventory.zone.id))
    ).map((zoneId) =>
      productInventories.find((inventory) => inventory.zone.id === zoneId).zone
    );

  return (
    <Box component="form" onSubmit={handleTransfer} sx={{ mt: 2 }}>
      <Card>
        <CardContent>
          {transfers.map((transfer, index) => {
            const selectedProductInventories = inventories
              ? inventories.filter(
                  (inventory) => inventory.product.id === transfer.productId
                )
              : [];

            const selectedZoneInventories = selectedProductInventories.filter(
              (inventory) => inventory.zone.id === transfer.fromZoneId
            );

            return (
              <Paper elevation={3} sx={{ mb: 3, p: 2 }} key={index}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                    >
                      <InputLabel id={`product-label-${index}`}>
                        Product
                      </InputLabel>
                      <Select
                        labelId={`product-label-${index}`}
                        value={transfer.productId}
                        onChange={(e) =>
                          handleTransferChange(index, "productId", e.target.value)
                        }
                        label="Product"
                        disabled={isFormDisabled}
                      >
                        {uniqueProducts.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                    >
                      <InputLabel id={`from-zone-label-${index}`}>
                        From Zone
                      </InputLabel>
                      <Select
                        labelId={`from-zone-label-${index}`}
                        value={transfer.fromZoneId}
                        onChange={(e) =>
                          handleTransferChange(index, "fromZoneId", e.target.value)
                        }
                        label="From Zone"
                        disabled={isFormDisabled || !transfer.productId}
                      >
                        {uniqueZones(selectedProductInventories).map(
                          (zone, zoneIndex) => (
                            <MenuItem key={zoneIndex} value={zone.id}>
                              {zone.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                    {transfer.fromZoneId && (
                      <Typography variant="body2">
                        Available Quantity:{" "}
                        {selectedZoneInventories.find(
                          (inventory) =>
                            inventory.zone.id === transfer.fromZoneId &&
                            inventory.expiredAt === transfer.expiredAt
                        )?.quantity || 0}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                    >
                      <InputLabel id={`expired-at-label-${index}`}>
                        Expired At
                      </InputLabel>
                      <Select
                        labelId={`expired-at-label-${index}`}
                        value={transfer.expiredAt}
                        onChange={(e) =>
                          handleTransferChange(index, "expiredAt", e.target.value)
                        }
                        label="Expired At"
                        disabled={isFormDisabled || !transfer.fromZoneId}
                      >
                        {selectedZoneInventories.map((inventory) => (
                          <MenuItem
                            key={inventory.expiredAt}
                            value={inventory.expiredAt}
                          >
                            {new Date(inventory.expiredAt).toLocaleDateString()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {transfer.toZones.map((zone, zoneIndex) => (
                    <Grid item xs={12} key={zoneIndex}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                          >
                            <InputLabel id={`to-zone-label-${index}-${zoneIndex}`}>
                              To Zone
                            </InputLabel>
                            <Select
                              labelId={`to-zone-label-${index}-${zoneIndex}`}
                              value={zone.toZoneId}
                              onChange={(e) =>
                                handleZoneChange(
                                  index,
                                  zoneIndex,
                                  "toZoneId",
                                  e.target.value
                                )
                              }
                              label="To Zone"
                              disabled={isFormDisabled}
                            >
                              {zones?.data?.map((zone) => (
                                <MenuItem key={zone.id} value={zone.id}>
                                  {zone.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            label="Quantity"
                            value={zone.quantity}
                            onChange={(e) =>
                              handleZoneChange(
                                index,
                                zoneIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                            required
                            type="number"
                            error={!!zone.quantityError}
                            helperText={zone.quantityError}
                            disabled={isFormDisabled}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => handleRemoveZone(index, zoneIndex)}
                            disabled={transfer.toZones.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      onClick={() => handleAddZone(index)}
                      startIcon={<AddIcon />}
                      disabled={isLoading || isFormDisabled}
                    >
                      Add Zone
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Transfer {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveTransfer(index)}
                    disabled={transfers.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
          <Button
            onClick={handleAddTransfer}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            disabled={isLoading || isFormDisabled}
            variant="outlined"
          >
            Add Transfer
          </Button>
          <Box sx={{ my: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading || isFormDisabled}
            >
              Transfer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffTransfer;
