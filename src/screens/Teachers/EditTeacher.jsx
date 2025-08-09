import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const classes = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
const genders = ['Male', 'Female', 'Other'];

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'teachers', id));
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  if (!form) return <LoadingSpinner />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'teachers', id), {
      ...form,
      teacherId: Number(form.teacherId),
    });
    navigate('/teachers/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Teacher
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" name="firstName" fullWidth value={form.firstName} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" name="lastName" fullWidth value={form.lastName} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" fullWidth value={form.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teacher ID" name="teacherId" type="number" fullWidth value={form.teacherId} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Class</InputLabel>
                <Select name="class" value={form.class} onChange={handleChange}>
                  {classes.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={form.gender} onChange={handleChange}>
                  {genders.map((g) => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained">Save Changes</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}