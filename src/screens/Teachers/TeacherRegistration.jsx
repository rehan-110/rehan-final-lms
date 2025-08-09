import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const classes = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
const genders = ['Male', 'Female', 'Other'];

export default function TeacherRegistration() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    teacherId: '',
    class: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});

  /* live validation */
  const validate = async (name, val) => {
    let msg = '';
    if (!val || val.toString().trim() === '') msg = 'Required';
    if (name === 'teacherId') {
      if (!val || isNaN(val)) msg = 'Numeric ID required';
      else {
        const q = query(collection(db, 'teachers'), where('teacherId', '==', Number(val)));
        if (!(await getDocs(q)).empty) msg = 'Teacher ID already exists';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate once
    const keys = Object.keys(values);
    for (const k of keys) await validate(k, values[k]);
    const allValid = keys.every((k) => !errors[k] && values[k]);
    if (!allValid) return;

    await addDoc(collection(db, 'teachers'), {
      ...values,
      teacherId: Number(values.teacherId),
      createdAt: new Date(),
    });
    navigate('/teachers/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Teacher Registration Form
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teacher ID"
                name="teacherId"
                type="number"
                fullWidth
                value={values.teacherId}
                onChange={handleChange}
                error={!!errors.teacherId}
                helperText={errors.teacherId}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.class}>
                <InputLabel>Class</InputLabel>
                <Select name="class" value={values.class} onChange={handleChange}>
                  {classes.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={values.gender} onChange={handleChange}>
                  {genders.map((g) => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={Object.values(errors).some((e) => e)}
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