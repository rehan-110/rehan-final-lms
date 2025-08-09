import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid, Typography, Alert
} from '@mui/material';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    class: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [studentExists, setStudentExists] = useState(false);

  const validate = (name, val) => {
    let msg = '';
    if (!val || val.trim() === '') msg = 'Required';
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  useEffect(() => {
    const checkStudentExists = async () => {
      const q = query(collection(db, 'students'), where('studentId', '==', values.studentId));
      const querySnapshot = await getDocs(q);
      setStudentExists(!querySnapshot.empty);
    };

    if (values.studentId) {
      checkStudentExists();
    }
  }, [values.studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields
    const keys = Object.keys(values);
    keys.forEach((k) => validate(k, values[k]));
    const allValid = keys.every((k) => !errors[k] && values[k]);
    if (!allValid || studentExists) return;

    await addDoc(collection(db, 'students'), {
      ...values,
      createdAt: new Date(),
    });
    navigate('/students/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Admission Form
      </Typography>

      {studentExists && (
        <Alert severity="error" sx={{ mb: 2 }}>
          A student with this ID already exists.
        </Alert>
      )}

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={values.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={values.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Student ID"
                name="studentId"
                type="number"
                fullWidth
                value={values.studentId}
                onChange={handleChange}
                error={!!errors.studentId}
                helperText={errors.studentId}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Class"
                name="class"
                fullWidth
                value={values.class}
                onChange={handleChange}
                error={!!errors.class}
                helperText={errors.class}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Gender"
                name="gender"
                fullWidth
                value={values.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                required
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={Object.values(errors).some((e) => e) || studentExists}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}