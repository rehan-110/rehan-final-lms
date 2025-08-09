import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Toolbar, useTheme, useMediaQuery
} from '@mui/material';
import {
  People, Person, Book, Description, AccountBalance,
  Class as ClassIcon, Payment, Assignment, Assessment,
  ExpandLess, ExpandMore
} from '@mui/icons-material';
import { setMobileOpen } from '../../store/slices/uiSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
const drawerWidth = 240;

const menuItems = [ {
    name: 'Dashboard',
    icon: <DashboardIcon sx={{color: 'primary.main'}} />,
    path: '/dashboard',
  },
  {
    name: 'Students',
    icon: <People sx={{color: 'primary.main'}} />,
    path: '/students',
    subItems: [
      { name: 'Student List', path: '/students/list' },
      { name: 'Registration', path: '/students/register' },
      { name: 'Transfer', path: '/students/transfer' },
    ],
  },
  {
    name: 'Teachers',
    icon: <Person sx={{color: 'primary.main'}} />,
    path: '/teachers',
    subItems: [
      { name: 'Teacher List', path: '/teachers/list' },
      { name: 'Registration', path: '/teachers/register' },
      { name: 'Allocation', path: '/teachers/allocation' },
    ],
  },
  {
    name: 'Subjects',
    icon: <Book sx={{color: 'primary.main'}}/>,
    path: '/subjects',
    subItems: [
      { name: 'Subject List', path: '/subjects/list' },
      { name: 'Add Subject', path: '/subjects/add' },
    ],
  },
  {
    name: 'Syllabus',
    icon: <Description sx={{color: 'primary.main'}}/>,
    path: '/syllabus',
    subItems: [
      { name: 'Syllabus List', path: '/syllabus/list' },
      { name: 'Add Syllabus', path: '/syllabus/add' },
    ],
  },
  {
    name: 'Schools',
    icon: <AccountBalance sx={{color: 'primary.main'}}/>,
    path: '/schools',
    subItems: [
      { name: 'School List', path: '/schools/list' },
      { name: 'Add School', path: '/schools/add' },
    ],
  },
  {
    name: 'Classes',
    icon: <ClassIcon sx={{color: 'primary.main'}}/>,
    path: '/classes',
    subItems: [
      { name: 'Class List', path: '/classes/list' },
      { name: 'Add Class', path: '/classes/add' },
    ],
  },
  {
    name: 'Fees',
    icon: <Payment sx={{color: 'primary.main'}}/>,
    path: '/fees',
    subItems: [
      { name: 'Fee List', path: '/fees/list' },
      { name: 'Fee Structure', path: '/fees/structure' },
      { name: 'Fee Vouchers', path: '/fees/vouchers' },
    ],
  },
  {
    name: 'Admission',
    icon: <Assignment sx={{color: 'primary.main'}} />,
    path: '/admission',
    subItems: [
      { name: 'Admission Form', path: '/admission/form' },
    ],
  },
  {
    name: 'Exam',
    icon: <Assessment sx={{color: 'primary.main'}} />,
    path: '/exam',
    subItems: [
      { name: 'Schedule', path: '/exam/schedule' },
      { name: 'Add Schedule', path: '/exam/schedule/add' },
      { name: 'Results', path: '/exam/results' },
      { name: 'Add Result', path: '/exam/results/add' },
    ],
  },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, mobileOpen } = useSelector((s) => s.ui);

  /* 🔧 single-open dropdown state */
  const [open, setOpen] = useState(null);
  const handleToggle = (key) => setOpen(open === key ? null : key);

  const handleDrawerToggle = () => dispatch(setMobileOpen(false));

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <div key={item.name}>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() =>
                item.subItems ? handleToggle(item.name) : navigate(item.path)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
              {item.subItems && (
  open === item.name ? <ExpandLess /> : <ExpandMore />
)}
            </ListItemButton>

            {item.subItems && (
              <Collapse
  in={open === item.name}
  timeout={300}
  mountOnEnter
  unmountOnExit
  sx={{
    transition: 'all 0.3s ease-in-out',
    '& .MuiCollapse-wrapper': {
      transition: 'all 0.3s ease-in-out',
    },
  }}
>
  <List component="div" disablePadding>
    {item.subItems.map((sub) => (
      <ListItemButton
        key={sub.path}
        sx={{ pl: 4 }}
        selected={location.pathname === sub.path}
        onClick={() => {
          navigate(sub.path);
          if (isMobile) handleDrawerToggle();
        }}
      >
        <ListItemText primary={sub.name} />
      </ListItemButton>
    ))}
  </List>
</Collapse>
            )}
          </div>
        ))}
      </List>
    </>
  );

  return (
    <>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: sidebarOpen ? drawerWidth : 0,
              transition: theme.transitions.create('width'),
              overflowX: 'hidden',
              backgroundColor: '#e5e9eeff',
              color: 'primary.main'
            },
          }}
          open={sidebarOpen}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}