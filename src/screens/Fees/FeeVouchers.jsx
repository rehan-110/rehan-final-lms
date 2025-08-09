import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Typography, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Checkbox,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function FeeVouchers() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, 'feeVouchers'), (snap) =>
      setRows(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      )
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.studentId?.toLowerCase().includes(q) ||
      r.feeId?.toLowerCase().includes(q) ||
      r.amount?.toString().includes(q) ||
      r.dueDate?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleSelectAll = (e) => {
    const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    setSelected(e.target.checked ? visible.map((r) => r.id) : []);
  };
  const isSelected = (id) => selected.includes(id);

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Fee Vouchers List
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search vouchers"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={() => navigate('/fees/structure')}>
          Add New Voucher
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filtered.length
                  }
                  checked={
                    filtered.length > 0 && selected.length === filtered.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Fee ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} selected={isSelected(row.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row.id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.studentId}</TableCell>
                  <TableCell>{row.feeId}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/fees/edit/${row.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (window.confirm('Delete this voucher?')) {
                          await deleteDoc(doc(db, 'feeVouchers', row.id));
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Table>
      </TableContainer>
    </Box>
  );
}