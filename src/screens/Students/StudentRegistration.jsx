import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const classes = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
const genders = ['Male', 'Female', 'Other'];

export default function StudentRegistration() {
  const navigate = useNavigate();

  /* form state */
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    class: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = async (name, val) => {
    let msg = '';
    if (!val || val.toString().trim() === '') {
      msg = 'This field is required';
    }
    if (name === 'studentId') {
      if (!val || isNaN(val)) {
        msg = 'Numeric ID required';
      } else {
        const q = query(collection(db, 'students'), where('studentId', '==', Number(val)));
        const snap = await getDocs(q);
        if (!snap.empty) msg = 'ID already exists';
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

    const required = ['firstName', 'lastName', 'email', 'studentId', 'class', 'gender'];
    let valid = true;
    for (const key of required) {
      await validate(key, values[key]);
      if (errors[key] || !values[key]) valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'students'), {
        ...values,
        studentId: Number(values.studentId),
        createdAt: new Date(),
      });
      navigate('/students/list');
    } catch {
      setErrors({ submit: 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Student Registration Form
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.class}>
                <InputLabel>Class</InputLabel>
                <Select name="class" value={values.class} onChange={handleChange}>
                  {classes.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
                {errors.class && <Typography variant="caption" color="error">{errors.class}</Typography>}
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
                {errors.gender && <Typography variant="caption" color="error">{errors.gender}</Typography>}
              </FormControl>
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" align="center">{errors.submit}</Typography>
              </Grid>
            )}

            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}