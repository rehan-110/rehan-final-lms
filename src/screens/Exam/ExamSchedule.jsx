import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Typography, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Checkbox, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ExamSchedule() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, 'examSchedules'), (snap) =>
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.subject?.toLowerCase().includes(q) ||
      r.date?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleSelectAll = (e) => {
    const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    setSelected(e.target.checked ? visible.map((r) => r.id) : []);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Exam Schedule
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search schedule" variant="outlined" size="small" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => navigate('/exam/schedule/add')}>Add Schedule</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.startTime} – {row.endTime}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/exam/schedule/edit/${row.id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={async () => { if (window.confirm('Delete?')) await deleteDoc(doc(db,'examSchedules',row.id)); }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5,10,25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_,p)=>setPage(p)}
        />
      </TableContainer>
    </Box>
  );
}