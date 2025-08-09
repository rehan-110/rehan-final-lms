import { Routes, Route } from 'react-router-dom';
import StudentList        from './StudentList';
import StudentRegistration from './StudentRegistration';
import TransferStudent    from './TransferStudent';
import EditStudent        from './EditStudent';

export default function Students() {
  return (
    <Routes>
      <Route path="list"     element={<StudentList />} />
      <Route path="register" element={<StudentRegistration />} />
      <Route path="transfer" element={<TransferStudent />} />
      <Route path="edit/:id" element={<EditStudent />} />
    </Routes>
  );
}