import { CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={size} />
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;