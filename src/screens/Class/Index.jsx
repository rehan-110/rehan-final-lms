import { Routes, Route } from 'react-router-dom';
import ClassList from './ClassList';
import AddClass from './AddClass';
import EditClass from './EditClass';

export default function Class() {
  return (
    <Routes>
      <Route path="list" element={<ClassList />} />
      <Route path="add" element={<AddClass />} />
      <Route path="edit/:id" element={<EditClass />} />
    </Routes>
  );
}