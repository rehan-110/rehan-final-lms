import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Autocomplete, TextField, Button, Alert } from '@mui/material';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function TeacherAllocation() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newClass, setNewClass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'teachers'));
      setTeachers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  const handleAllocate = async () => {
    if (!selectedTeacher || !newClass) {
      setError('Select a teacher and a class');
      return;
    }
    try {
      const q = query(collection(db, 'teachers'), where('teacherId', '==', selectedTeacher.teacherId));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Teacher not found');
        return;
      }
      await updateDoc(doc(db, 'teachers', snap.docs[0].id), {
        allocatedClass: newClass,
        allocatedAt: new Date().toISOString(),
      });
      setError('');
      alert('Allocation recorded');
    } catch {
      setError('Allocation failed');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Teacher Allocation
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Autocomplete
          options={teachers}
          getOptionLabel={(t) => `${t.teacherId} – ${t.firstName} ${t.lastName}`}
          onChange={(_, val) => setSelectedTeacher(val)}
          renderInput={(params) => (
            <TextField {...params} label="Teacher" margin="normal" />
          )}
          fullWidth
        />

        <TextField
          label="Allocated Class"
          fullWidth
          margin="normal"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleAllocate}>
          Record Allocation
        </Button>
      </Paper>
    </Box>
  );
}