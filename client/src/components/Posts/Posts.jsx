import { Typography, Alert, Button, Skeleton, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Post from './Post/Post';

// Cards are emitted as direct grid children so they flow around the form,
// filling the column beneath it instead of leaving it empty.
const SkeletonCard = () => (
  <Box sx={{ borderRadius: '15px', overflow: 'hidden', bgcolor: '#fff' }}>
    <Skeleton variant="rectangular" height={160} />
    <Box sx={{ padding: 2 }}>
      <Skeleton width="40%" height={18} />
      <Skeleton width="80%" height={32} />
      <Skeleton width="100%" height={18} />
      <Skeleton width="60%" height={18} />
    </Box>
  </Box>
);

const FullWidth = ({ children }) => (
  <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>
);

const Posts = ({ setCurrentId, onRetry, onDeleted, skeletonCount = 8 }) => {
  const { posts, isLoading, error } = useSelector((state) => state.posts);

  if (isLoading) {
    return Array.from({ length: skeletonCount }, (_, i) => <SkeletonCard key={i} />);
  }

  if (error) {
    return (
      <FullWidth>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      </FullWidth>
    );
  }

  if (!posts.length) {
    return (
      <FullWidth>
        <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
          No memories yet. Create the first one!
        </Typography>
      </FullWidth>
    );
  }

  return posts.map((post) => (
    <Post key={post._id} post={post} setCurrentId={setCurrentId} onDeleted={onDeleted} />
  ));
};

export default Posts;
