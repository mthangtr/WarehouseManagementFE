import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useGetInventoriesByWarehouseIdQuery } from "../../redux/api/inventoryApiSlice";
import { useGetZoneByWarehouseIdQuery } from "../../redux/api/zoneApiSlice";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  Stack,
  Pagination,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StaffTransfer from "./StaffTransfer";
import useDocumentTitle from "../../utils/UseDocumentTitle";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import { message } from "antd";

const StaffProduct = () => {
  useDocumentTitle('Data')
  const userInfo = useSelector((state) => state.auth);
  if (!userInfo) {
    return <Navigate to={"/"} replace />;
  }

  let authToken;
  let wid;
  if (userInfo && userInfo.userInfo && userInfo.userInfo.data) {
    authToken = userInfo.userInfo.data.token;
    wid = userInfo.userInfo.data.warehouseId;
  }

  const [warehouseId, setWarehouseId] = useState(wid);
  const { data: inventories, error: inventoriesError, isLoading: inventoriesLoading } = useGetInventoriesByWarehouseIdQuery({ warehouseId, authToken });
  // console.log(inventories);
  const { data: zones, error: zonesError, isLoading: zonesLoading } = useGetZoneByWarehouseIdQuery({ id: wid, authToken });

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('quantity');
  const [searchProductName, setSearchProductName] = useState('');
  const [filterZoneName, setFilterZoneName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const rowsPerPage = 10; // Initial rows per page, this can be adjusted dynamically based on the height of the container

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchProductNameChange = (event) => {
    setSearchProductName(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleFilterZoneNameChange = (event) => {
    setFilterZoneName(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleTransferClick = (inventory) => {
    setSelectedInventory(inventory);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (inventoriesLoading || zonesLoading) return <Loading />;
  if (inventoriesError) return <Error500 />;
  if (zonesError) return <Error500 />;

  const filteredInventories = inventories.filter((inventory) => {
    return (
      inventory.product.name.toLowerCase().includes(searchProductName.toLowerCase()) &&
      (filterZoneName === '' || inventory.zone.name === filterZoneName)
    );
  });

  const sortedInventories = [...filteredInventories].sort((a, b) => {
    if (orderBy === 'quantity') {
      return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    } else {
      return order === 'asc' ? new Date(a.expiredAt) - new Date(b.expiredAt) : new Date(b.expiredAt) - new Date(a.expiredAt);
    }
  });

  const paginatedInventories = sortedInventories.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="table-container">
      <Box sx={{ padding: 2 }} >
        <TextField
          label="Search by Product Name"
          variant="outlined"
          value={searchProductName}
          onChange={handleSearchProductNameChange}
          sx={{ marginRight: 2 }}
          className="bg-white"
        />
        <FormControl variant="outlined" sx={{ minWidth: 200 }} className="bg-white">
          <InputLabel>Filter by Zone Name</InputLabel>
          <Select
            value={filterZoneName}
            onChange={handleFilterZoneNameChange}
            label="Filter by Zone Name"
          >
            <MenuItem value="">
              <em>All Zones</em>
            </MenuItem>
            {zones?.data?.map((zone) => (
              <MenuItem key={zone.id} value={zone.name}>
                {zone.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer className="table" component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Zone Name</TableCell>
              <TableCell sortDirection={orderBy === 'quantity' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'quantity'}
                  direction={orderBy === 'quantity' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'expiredAt' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'expiredAt'}
                  direction={orderBy === 'expiredAt' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'expiredAt')}
                >
                  Expired At
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInventories.map((inventory) => (inventory.quantity > 0 &&
              <TableRow key={inventory.id}>
                <TableCell>{inventory.product.name}</TableCell>
                <TableCell>{inventory.zone.name}</TableCell>
                <TableCell>{inventory.quantity}</TableCell>
                <TableCell>{new Date(inventory.expiredAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTransferClick(inventory)}
                  >
                    Transfer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} className="pagination">
        <Pagination
          count={Math.ceil(filteredInventories.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Stack>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Transfer Products</DialogTitle>
        <DialogContent>
          <StaffTransfer
            initialInventory={selectedInventory}
            authToken={authToken}
            onTransferSuccess={handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffProduct;
