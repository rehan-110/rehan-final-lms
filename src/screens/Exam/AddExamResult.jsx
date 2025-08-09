import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AddExamResult() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    marks: '',
    grade: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.subject || !form.marks || !form.grade) return;
    await addDoc(collection(db, 'examResults'), {
      ...form,
      marks: Number(form.marks),
      createdAt: new Date(),
    });
    navigate('/exam/results');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Exam Result
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Student ID"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Marks"
                name="marks"
                type="number"
                value={form.marks}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained">Save Result</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}