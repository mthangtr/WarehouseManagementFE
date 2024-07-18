import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import { Button } from "antd";

const createData = (name, id, description, categoryName) => {
  return { name, id, description, categoryName };
};

const ProductTable = ({ productList, page, setPage, rowsPerPage, showModal }) => {
  const adjustedList = [...productList];
  if (adjustedList.length > 1) {
    const lastItem = adjustedList.pop();
    adjustedList.unshift(lastItem);
  }

  rowsPerPage = 10;
  const rows = adjustedList.map((product) =>
    createData(product.name, product.id, product.description, product.category.name)
  );

  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="Table">
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } ,
                backgroundColor: index % 2 === 0 ? "#e0e0e0" : "#ffffff"}}
              >
                <TableCell component="th" scope="row">
                  {(page - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.categoryName}</TableCell>
                <TableCell align="left" className="Details">
                  <Button
                    type="primary"
                    onClick={() => showModal(row.id)}
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
        count={Math.ceil(rows.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default ProductTable;
