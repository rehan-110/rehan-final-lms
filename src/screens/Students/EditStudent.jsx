import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'students', id));
      setForm(snap.exists() ? snap.data() : null);
    })();
  }, [id]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'students', id), {
      ...form,
      studentId: Number(form.studentId),
    });
    navigate('/students/list');
  };

  if (!form) return <LoadingSpinner />;

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Student
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handle} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name"  name="lastName"  value={form.lastName}  onChange={handle} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email"      name="email"     value={form.email}     onChange={handle} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Student ID" name="studentId" value={form.studentId} onChange={handle} type="number" required /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Class</InputLabel>
                <Select name="class" value={form.class} onChange={handle}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={form.gender} onChange={handle}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained">Save</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}