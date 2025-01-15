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

const createData = (name, id, description, categoryName) => {
  return { name, id, description, categoryName };
};

const ProductTable = ({
  productList,
  page,
  setPage,
  rowsPerPage,
  showModal,
}) => {
  rowsPerPage=10;
  const [anchorElName, setAnchorElName] = useState(null);
  const [anchorElCategory, setAnchorElCategory] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [searchName, setSearchName] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const rows = productList.map((product) =>
    createData(
      product.name,
      product.id,
      product.description,
      product.category.name
    )
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
      row.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterCategory === "" || row.categoryName === filterCategory)
    );
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

  const handleOpenCategoryMenu = (event) => {
    setAnchorElCategory(event.currentTarget);
  };

  const handleCloseCategoryMenu = () => {
    setAnchorElCategory(null);
  };

  const handleFilterCategory = (category) => {
    setFilterCategory(category);
    handleCloseCategoryMenu();
  };


  return (
    <div className="table-container">
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
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Category
                  <IconButton size="small" onClick={handleOpenCategoryMenu}>
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElCategory}
                    open={Boolean(anchorElCategory)}
                    onClose={handleCloseCategoryMenu}
                  >
                    <MenuItem onClick={() => handleFilterCategory("")}>
                      All
                    </MenuItem>
                    {productList
                      .map((product) => product.category.name)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((category) => (
                        <MenuItem
                          key={category}
                          onClick={() => handleFilterCategory(category)}
                        >
                          {category}
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
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.categoryName}</TableCell>
                <TableCell align="left" className="Details">
                  <Button type="primary" onClick={() => showModal(row.id)}>
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

export default ProductTable;
