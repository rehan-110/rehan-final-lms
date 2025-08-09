import { Routes, Route } from 'react-router-dom';
import SyllabusList from './SyllabusList';
import AddSyllabus from './AddSyllabus';
import EditSyllabus from './EditSyllabus';

export default function Syllabus() {
  return (
    <Routes>
      <Route path="list" element={<SyllabusList />} />
      <Route path="add" element={<AddSyllabus />} />
      <Route path="edit/:id" element={<EditSyllabus />} />
    </Routes>
  );
}