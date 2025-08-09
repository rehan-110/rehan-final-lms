import { Routes, Route } from 'react-router-dom';
import AdmissionForm from './AdmissionForm';

export default function Admission() {
  return (
    <Routes>
      <Route path="form" element={<AdmissionForm />} />
    </Routes>
  );
}