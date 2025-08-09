import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { auth } from '../../config/firebase';
import { setUser, setLoading } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(setLoading(true));
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      dispatch(setUser({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
      }));

      toast.success('Logged in successfully!');
      navigate('/students');
    } catch (error) {
      toast.error(error.message);
      dispatch(setLoading(false));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            size="large"
          >
            Login
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default LoginForm;