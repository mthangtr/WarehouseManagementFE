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

const createData = (fullName, trackingId, onCharge, status) => {
  return { fullName, trackingId, onCharge, status };
};

const makeStyle = (status) => {
  if (status === "Approved") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "Pending" || status === "ADMIN") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

const StaffTable = ({ staffList, page, setPage, rowsPerPage, showModal }) => {
  rowsPerPage=10;
  const [anchorElFullName, setAnchorElFullName] = useState(null);
  const [anchorElOnCharge, setAnchorElOnCharge] = useState(null);
  const [anchorElRole, setAnchorElRole] = useState(null);

  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchFullName, setSearchFullName] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const rows = staffList.map((staff) =>
    createData(staff.fullName, staff.id, staff?.warehouse?.name, staff.role)
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
    return (
      row.fullName.toLowerCase().includes(searchFullName.toLowerCase()) &&
      (filterWarehouse === "" || row.onCharge === filterWarehouse) &&
      (filterRole === "" || row.status === filterRole)
    );
  });

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenFullNameMenu = (event) => {
    setAnchorElFullName(event.currentTarget);
  };

  const handleCloseFullNameMenu = () => {
    setAnchorElFullName(null);
  };

  const handleOpenOnChargeMenu = (event) => {
    setAnchorElOnCharge(event.currentTarget);
  };

  const handleCloseOnChargeMenu = () => {
    setAnchorElOnCharge(null);
  };

  const handleOpenRoleMenu = (event) => {
    setAnchorElRole(event.currentTarget);
  };

  const handleCloseRoleMenu = () => {
    setAnchorElRole(null);
  };

  const handleFilterWarehouse = (warehouse) => {
    setFilterWarehouse(warehouse);
    handleCloseOnChargeMenu();
  };

  const handleFilterRole = (role) => {
    setFilterRole(role);
    handleCloseRoleMenu();
  };

  return (
    <div className="table-container">
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Full Name
                  <IconButton size="small" onClick={handleOpenFullNameMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElFullName}
                    open={Boolean(anchorElFullName)}
                    onClose={handleCloseFullNameMenu}
                  >
                    <MenuItem onClick={() => handleSort("fullName")}>
                      Sort
                    </MenuItem>
                    <MenuItem>
                      <TextField
                        placeholder="Search"
                        value={searchFullName}
                        onChange={(e) => setSearchFullName(e.target.value)}
                        fullWidth
                      />
                    </MenuItem>
                  </Menu>
                </div>
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("trackingId")}>
                Tracking ID
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  On Charge
                  <IconButton size="small" onClick={handleOpenOnChargeMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElOnCharge}
                    open={Boolean(anchorElOnCharge)}
                    onClose={handleCloseOnChargeMenu}
                  >
                    <MenuItem onClick={() => handleFilterWarehouse("")}>
                      All
                    </MenuItem>
                    {staffList
                      .map((staff) => staff.warehouse?.name)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((warehouse) => (
                        <MenuItem
                          key={warehouse}
                          onClick={() => handleFilterWarehouse(warehouse)}
                        >
                          {warehouse}
                        </MenuItem>
                      ))}
                  </Menu>
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Role
                  <IconButton size="small" onClick={handleOpenRoleMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElRole}
                    open={Boolean(anchorElRole)}
                    onClose={handleCloseRoleMenu}
                  >
                    {staffList
                      .map((staff) => staff.role)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((role) => (
                        <MenuItem
                          key={role}
                          onClick={() => handleFilterRole(role)}
                        >
                          {role}
                        </MenuItem>
                      ))}
                  </Menu>
                </div>
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.trackingId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">{row.fullName}</TableCell>
                <TableCell align="left">{row.trackingId}</TableCell>
                <TableCell align="left">{row.onCharge}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="left" className="Details">
                  <Button
                    type="primary"
                    onClick={() => showModal(row.trackingId)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredRows.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        showFirstButton
        showLastButton
        className="pagination"
        siblingCount={1}
        boundaryCount={1}
      />
    </div>
  );
};

export default StaffTable;
