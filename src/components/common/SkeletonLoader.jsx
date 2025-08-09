import { Skeleton, Box } from '@mui/material';

const SkeletonLoader = ({ type = 'list' }) => {
  if (type === 'list') {
    return (
      <Box sx={{ pt: 0.5 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        ))}
      </Box>
    );
  }

  return <Skeleton variant="rectangular" width="100%" height={400} />;
};

export default SkeletonLoader;