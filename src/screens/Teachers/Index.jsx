import { Routes, Route } from 'react-router-dom';
import TeacherList        from './TeacherList';
import TeacherRegistration from './TeacherRegistration';
import TeacherAllocation   from './TeacherAllocation';
import EditTeacher         from './EditTeacher';

export default function Teachers() {
  return (
    <Routes>
      <Route path="list"       element={<TeacherList />} />
      <Route path="register"   element={<TeacherRegistration />} />
      <Route path="allocation" element={<TeacherAllocation />} />
      <Route path="edit/:id"   element={<EditTeacher />} />
    </Routes>
  );
}