import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Grid, Typography, Alert } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AddExamSchedule() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ subject: '', date: '', startTime: '', endTime: '', duration: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!values.subject.trim()) {
      newErrors.subject = 'Subject is required';
      valid = false;
    }

    if (!values.date) {
      newErrors.date = 'Date is required';
      valid = false;
    }

    if (!values.startTime) {
      newErrors.startTime = 'Start Time is required';
      valid = false;
    }

    if (!values.endTime) {
      newErrors.endTime = 'End Time is required';
      valid = false;
    }

    if (!values.duration.trim()) {
      newErrors.duration = 'Duration is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await addDoc(collection(db, 'examSchedules'), { ...values, createdAt: new Date() });
      navigate('/exam/schedule');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Exam Schedule
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject"
                fullWidth
                value={values.subject}
                onChange={handleChange}
                error={!!errors.subject}
                helperText={errors.subject}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                type="date"
                fullWidth
                value={values.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                name="startTime"
                fullWidth
                value={values.startTime}
                onChange={handleChange}
                error={!!errors.startTime}
                helperText={errors.startTime}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Time"
                name="endTime"
                fullWidth
                value={values.endTime}
                onChange={handleChange}
                error={!!errors.endTime}
                helperText={errors.endTime}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Duration"
                name="duration"
                fullWidth
                value={values.duration}
                onChange={handleChange}
                error={!!errors.duration}
                helperText={errors.duration}
                required
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}