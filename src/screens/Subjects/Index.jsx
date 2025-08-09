import { Routes, Route } from 'react-router-dom';
import SubjectList   from './SubjectList';
import AddSubject    from './AddSubject';
import EditSubject   from './EditSubject';

export default function Subjects() {
  return (
    <Routes>
      <Route path="list"  element={<SubjectList />} />
      <Route path="add"   element={<AddSubject />} />
      <Route path="edit/:id" element={<EditSubject />} />
    </Routes>
  );
}