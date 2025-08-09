import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function EditExamSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db,'examSchedules',id));
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  if (!form) return <div>Loading...</div>;

  const save = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db,'examSchedules',id),form);
    navigate('/exam/schedule');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>Edit Exam Schedule</Typography>
      <Paper sx={{p:4,maxWidth:600,mx:'auto'}}>
        <Box component="form" onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Subject" name="subject" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Date" name="date" type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={6}><TextField label="Start Time" name="startTime" value={form.startTime} onChange={(e)=>setForm({...form,startTime:e.target.value})} fullWidth /></Grid>
            <Grid item xs={6}><TextField label="End Time" name="endTime" value={form.endTime} onChange={(e)=>setForm({...form,endTime:e.target.value})} fullWidth /></Grid>
            <Grid item xs={12}><TextField label="Duration" name="duration" value={form.duration} onChange={(e)=>setForm({...form,duration:e.target.value})} fullWidth /></Grid>
            <Grid item xs={12} textAlign="center"><Button type="submit" variant="contained">Update</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}