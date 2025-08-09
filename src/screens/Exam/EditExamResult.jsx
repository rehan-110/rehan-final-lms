import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function EditExamResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db,'examResults',id));
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  if (!form) return <div>Loading...</div>;

  const save = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db,'examResults',id),form);
    navigate('/exam/results');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>Edit Exam Result</Typography>
      <Paper sx={{p:4,maxWidth:600,mx:'auto'}}>
        <Box component="form" onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Student ID" name="studentId" value={form.studentId} onChange={(e)=>setForm({...form,studentId:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Subject" name="subject" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Marks" name="marks" type="number" value={form.marks} onChange={(e)=>setForm({...form,marks:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Grade" name="grade" value={form.grade} onChange={(e)=>setForm({...form,grade:e.target.value})} fullWidth required /></Grid>
            <Grid item xs={12} textAlign="center"><Button type="submit" variant="contained">Update</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}