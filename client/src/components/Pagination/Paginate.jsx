import { Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';

// Pages are links so the current page survives a reload, a back/forward press,
// and a shared URL.
const Paginate = ({ page, numberOfPages }) => {
  if (numberOfPages <= 1) return null;

  return (
    <Pagination
      count={numberOfPages}
      page={page}
      variant="outlined"
      color="primary"
      siblingCount={1}
      boundaryCount={1}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 4,
        padding: '16px 0',
      }}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  );
};

export default Paginate;
