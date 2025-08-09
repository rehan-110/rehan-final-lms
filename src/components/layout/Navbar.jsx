import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School as SchoolIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { auth } from '../../config/firebase';
import { clearUser } from '../../store/slices/authSlice';
import { toggleSidebar, setMobileOpen } from '../../store/slices/uiSlice';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Navbar = () => {
  const [logoutDialog, setLogoutDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, mobileOpen } = useSelector((s) => s.ui);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      setLogoutDialog(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(setMobileOpen(!mobileOpen));
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {isMobile ? (mobileOpen ? <ChevronLeftIcon /> : <MenuIcon />) : sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          >
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap>
              Sindh University Learning Management System
            </Typography>
          </motion.div>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => setLogoutDialog(true)}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>No</Button>
          <Button onClick={handleLogout} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;