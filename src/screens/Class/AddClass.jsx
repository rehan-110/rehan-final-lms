import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid, Typography
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AddClass() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keys = Object.keys(values);
    keys.forEach((k) => validate(k, values[k]));
    const allValid = keys.every((k) => !errors[k] && values[k]);
    if (!allValid) return;

    await addDoc(collection(db, 'classes'), {
      ...values,
      createdAt: new Date(),
    });
    navigate('/classes/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Class
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Class Name"
                name="name"
                fullWidth
                value={values.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Class Code"
                name="code"
                fullWidth
                value={values.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={Object.values(errors).some((e) => e)}
              >
                Add Class
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}