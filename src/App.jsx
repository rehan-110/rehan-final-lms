import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { auth } from './config/firebase';
import { setUser, setLoading } from './store/slices/authSlice';

import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import LoadingSpinner from './components/common/LoadingSpinner';

import Students   from './screens/Students/Index';
import Teachers   from './screens/Teachers';
import Subjects   from './screens/Subjects/Index';
import Syllabus   from './screens/Syllabus/Index';
import School from './screens/School/Index';
import Class      from './screens/Class/Index';
import Fees       from './screens/Fees/Index';
import Admission  from './screens/Admission/Index';
import Exam       from './screens/Exam/Index';
import Dashboard from './screens/Dashboard/Dashboard';

function RequireAuth() {
  const user = useSelector((s) => s.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

const theme = createTheme({
  palette: { primary: { main: '#2a51edff' }, secondary: { main: '#dc004e' } },
});

function App() {
  const dispatch = useDispatch();            
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        dispatch(setUser({ uid: u.uid, name: u.displayName, email: u.email }));
      }
      dispatch(setLoading(false));
    });
    return unsub;
  }, [dispatch]);
  if (isLoading) return <LoadingSpinner />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Router>
 <Routes>
  <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
  <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />

  <Route element={<RequireAuth />}>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />

      
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="students/*"  element={<Students />} />
      <Route path="teachers/*"  element={<Teachers />} />
      <Route path="subjects/*"  element={<Subjects />} />
      <Route path="syllabus/*"  element={<Syllabus />} />
      <Route path="schools/*"    element={<School />} />
      <Route path="classes/*"     element={<Class />} />
      <Route path="fees/*"      element={<Fees />} />
      <Route path="admission/*" element={<Admission />} />
      <Route path="exam/*"      element={<Exam />} />
      <Route path="*"           element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Route>
</Routes>
</Router>
    </ThemeProvider>
  );
}

export default App;
