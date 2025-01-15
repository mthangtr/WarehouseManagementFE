import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const createData = (id, name, description, status) => {
  return { id, name, description, status };
};

const makeStyle = (status) => {
  if (status === 'FULL') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    };
  } else if (status === 'EMPTY') {
    return {
      background: '#ffadad8f',
      color: 'red',
    };
  } else if (status === 'STILL') {
    return {
      background: '#59bfff',
      color: 'white',
    };
  } else {
    return {
      background: '#59bfff',
      color: 'white',
    };
  }
};

const StaffZoneTable = ({ zones, showModal, page, setPage, rowsPerPage, updateZoneStatus }) => {
  const rows = zones.map((zone) =>
    createData(zone.id, zone.name, zone.description, zone.zoneStatus)
  );

  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = (zoneId, newStatus) => {
    updateZoneStatus(zoneId, newStatus);
  };

  return (
    <div className="Table">
      <TableContainer
        component={Paper}
        style={{ boxShadow: '0px 13px 20px 0px #80808029' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">
                  <Select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    style={{ ...makeStyle(row.status), width: '100%' }}
                  >
                    <MenuItem value="FULL">FULL</MenuItem>
                    <MenuItem value="EMPTY">EMPTY</MenuItem>
                    <MenuItem value="STILL">STILL</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="left" className="Details">
                  <Link to={`/staff/data/zone/${row.id}/inventory`}>
                    <Button type="primary">
                      Inventories
                    </Button>
                  </Link>
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
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default StaffZoneTable;
