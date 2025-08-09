import { Routes, Route } from 'react-router-dom';
import SchoolList from './SchoolList';
import AddSchool from './AddSchool';
import EditSchool from './EditSchool';

export default function School() {
  return (
    <Routes>
      <Route path="list" element={<SchoolList />} />
      <Route path="add" element={<AddSchool />} />
      <Route path="edit/:id" element={<EditSchool />} />
    </Routes>
  );
}