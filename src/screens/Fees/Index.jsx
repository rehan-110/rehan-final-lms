import { Routes, Route } from 'react-router-dom';
import FeeList from './FeeList';
import FeeStructure from './FeeStructure';
import FeeVouchers from './FeeVouchers';
import FeeSubmission from './FeeSubmission';

export default function Fees() {
  return (
    <Routes>
      <Route path="list" element={<FeeList />} />
      <Route path="structure" element={<FeeStructure />} />
      <Route path="vouchers" element={<FeeVouchers />} />
      <Route path="submission/:voucherId" element={<FeeSubmission />} />
    </Routes>
  );
}