import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid, Typography
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function FeeSubmission() {
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'feeVouchers', voucherId));
      if (snap.exists()) setVoucher(snap.data());
    })();
  }, [voucherId]);

  if (!voucher) return <div>Loading...</div>;

  const handlePayment = async () => {
    // Mock payment submission
    await updateDoc(doc(db, 'feeVouchers', voucherId), {
      status: 'paid',
      paidAt: new Date(),
    });
    alert('Payment successful!');
    navigate('/fees/vouchers');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Fee Submission
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              Student ID: {voucher.studentId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Fee ID: {voucher.feeId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Amount: {voucher.amount}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Due Date: {voucher.dueDate}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" onClick={handlePayment}>
              Pay Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}