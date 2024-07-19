import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { Button } from "antd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const createData = (name, id, description, address, createdAt) => {
  return { name, id, description, address, createdAt };
};

const WarehouseTable = ({ warehouseList, page, setPage, rowsPerPage, showModal }) => {
  const [anchorElName, setAnchorElName] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchName, setSearchName] = useState("");

  const rows = warehouseList.map((warehouse) =>
    createData(warehouse.name, warehouse.id, warehouse.description, warehouse.address, warehouse.createdAt)
  );

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction: direction });
    setPage(1); // Reset to first page when sorting changes
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredRows = sortedRows.filter((row) => {
    return row.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenNameMenu = (event) => {
    setAnchorElName(event.currentTarget);
  };

  const handleCloseNameMenu = () => {
    setAnchorElName(null);
  };

  const navigate = useNavigate()

  const handleSeeZones = (id)=>{
    console.log(id);
    navigate(`/data/zone/warehouseId/${id}`)
  }

  return (
    <div className="table-container" style={{height:"100%"}}>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Name
                  <IconButton size="small" onClick={handleOpenNameMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElName}
                    open={Boolean(anchorElName)}
                    onClose={handleCloseNameMenu}
                  >
                    <MenuItem onClick={() => handleSort("name")}>Sort</MenuItem>
                    <MenuItem>
                      <TextField
                        placeholder="Search"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        fullWidth
                      />
                    </MenuItem>
                  </Menu>
                </div>
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("id")}>
                ID
              </TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left" onClick={() => handleSort("createdAt")}>
                Created At
              </TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell  scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.address}</TableCell>
                <TableCell align="left">{row.createdAt}</TableCell>
                <TableCell align="left" className="Details">
                  <Button type="primary" onClick={() => showModal(row.id)}>
                    Details
                  </Button>
                  
                </TableCell>

                <TableCell align="left" className="Details">
                <Button type="default" onClick={() => handleSeeZones(row.id)}>
                    Zones
                  </Button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} className="pagination">
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </div>
  );
};

export default WarehouseTable;
