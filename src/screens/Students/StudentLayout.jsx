import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const getTabValue = () => {
    if (location.pathname.includes('/students/list')) return 0;
    if (location.pathname.includes('/students/register')) return 1;
    if (location.pathname.includes('/students/transfer')) return 2;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/students/list');
        break;
      case 1:
        navigate('/students/register');
        break;
      case 2:
        navigate('/students/transfer');
        break;
      default:
        navigate('/students/list');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', flexGrow: 1 }}>
              Student Management
            </Typography>
            {location.pathname.includes('/students/list') && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/students/register')}
                sx={{ ml: 2 }}
              >
                Add New Student
              </Button>
            )}
          </Box>
          
          <Tabs value={getTabValue()} onChange={handleTabChange} centered>
            <Tab label="Student List" />
            <Tab label="Student Registration" />
            <Tab label="Transfer Student" />
          </Tabs>
        </Paper>
        
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </motion.div>
  );
};

export default StudentLayout;