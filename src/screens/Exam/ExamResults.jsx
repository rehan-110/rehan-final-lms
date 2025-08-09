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

export default function ExamResults() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    return onSnapshot(collection(db, 'examResults'), (snap) =>
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.studentId?.toLowerCase().includes(q) ||
      r.subject?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>Exam Results</Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search results" variant="outlined" size="small" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <Button variant="contained" onClick={()=>navigate('/exam/results/add')}>Add Result</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage).map((row)=>(
              <TableRow key={row.id}>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.marks}</TableCell>
                <TableCell>{row.grade}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={()=>navigate(`/exam/results/edit/${row.id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={async()=>{if(window.confirm('Delete result?')) await deleteDoc(doc(db,'examResults',row.id))}}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={filtered.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_,p)=>setPage(p)} />
      </TableContainer>
    </Box>
  );
}