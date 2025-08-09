import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid, Typography
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EditSchool() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'schools', id));
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  if (!form) return <LoadingSpinner />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'schools', id), form);
    navigate('/schools/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit School
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="School Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="School Code"
                name="code"
                fullWidth
                value={form.code}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                value={form.location}
                onChange={handleChange}
                required
              />
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