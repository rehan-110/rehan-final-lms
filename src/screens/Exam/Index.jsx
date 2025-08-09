import { Routes, Route } from 'react-router-dom';
import ExamSchedule from './ExamSchedule';
import AddExamSchedule from './AddExamSchedule';
import EditExamSchedule from './EditExamSchedule';

import ExamResults from './ExamResults';
import AddExamResult from './AddExamResult';
import EditExamResult from './EditExamResult';

export default function Exam() {
  return (
    <Routes>
      <Route path="schedule" element={<ExamSchedule />} />
      <Route path="schedule/add" element={<AddExamSchedule />} />
      <Route path="schedule/edit/:id" element={<EditExamSchedule />} />

      <Route path="results" element={<ExamResults />} />
      <Route path="results/add" element={<AddExamResult />} />
      <Route path="results/edit/:id" element={<EditExamResult />} />
    </Routes>
  );
}