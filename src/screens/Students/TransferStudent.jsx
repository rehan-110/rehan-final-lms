import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function TransferStudent() {
  const navigate = useNavigate();

  
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [studentId, setStudentId] = useState(null); 
  const [newSchool, setNewSchool] = useState('');
  const [newClass, setNewClass]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'students'));
        setStudents(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch {
        setError('Could not load students');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleTransfer = async () => {
    if (!studentId)      return setError('Please select a student');
    if (!newSchool.trim()) return setError('Please enter a new school');
    if (!newClass)       return setError('Please select a new class');

    try {
      const q = query(collection(db, 'students'), where('studentId', '==', Number(studentId)));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError('Selected student not found');
        return;
      }

      const docRef = snap.docs[0].ref;
      await updateDoc(docRef, {
        transferredTo: newSchool.trim(),
        transferredClass: newClass,
        status: 'transferred',
        transferredAt: new Date().toISOString(),
      });

      setError('');
      alert('Transfer recorded successfully');
      navigate('/students/list');
    } catch {
      setError('Transfer failed');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Transfer Student
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Autocomplete
          options={students}
          getOptionLabel={(stu) => `${stu.studentId} – ${stu.firstName} ${stu.lastName}`}
          onChange={(_, val) => setStudentId(val?.studentId ?? null)}
          renderInput={(params) => (
            <TextField {...params} label="Student" margin="normal" />
          )}
          fullWidth
        />

        <TextField
          fullWidth
          label="New School / Campus"
          margin="normal"
          value={newSchool}
          onChange={(e) => setNewSchool(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>New Class</InputLabel>
          <Select value={newClass} onChange={(e) => setNewClass(e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleTransfer}
        >
          Record Transfer
        </Button>
      </Paper>
    </Box>
  );
}