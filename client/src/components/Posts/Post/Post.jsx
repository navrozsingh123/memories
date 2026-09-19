import { Button, Typography, CardContent, Snackbar } from '@mui/material';
import { useState } from 'react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import {
  StyledCard,
  Media,
  Overlay,
  Overlay2,
  Details,
  CardActionsStyled,
} from './Styles';

const Likes = ({ likes, hasLiked }) => {
  if (!likes.length) {
    return <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;Like</>;
  }

  const Icon = hasLiked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;
  const label = hasLiked
    ? `You${likes.length > 1 ? ` and ${likes.length - 1} other${likes.length > 2 ? 's' : ''}` : ''}`
    : `${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}`;

  return <><Icon fontSize="small" />&nbsp;{label}</>;
};

// Inline so a memory without an image still renders with no network dependency.
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
       <rect width="400" height="225" fill="#e8eaf0"/>
       <g fill="none" stroke="#9aa3b5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
         <rect x="152" y="80" width="96" height="72" rx="8"/>
         <circle cx="176" cy="104" r="9"/>
         <path d="M152 136l26-24 22 20 18-14 30 26"/>
       </g>
     </svg>`
  );

function Post({ post, setCurrentId, onDeleted }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const userId = user?.result?._id;
  const [error, setError] = useState('');

  const likes = post.likes ?? [];
  const hasLiked = likes.includes(userId);

  return (
    <StyledCard>
      <Media image={post.selectedFile || PLACEHOLDER} title={post.title} />
      <Overlay>
        <Typography variant="h6">{post.name || post.creator}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </Overlay>
      <Overlay2>
        <Button
          style={{ color: 'white' }}
          size="small"
          aria-label="edit memory"
          onClick={() => setCurrentId(post._id)}
        >
          <MoreHorizIcon fontSize="medium" />
        </Button>
      </Overlay2>
      <Details>
        <Typography variant="body2" color="textSecondary" component="h2">
          {(post.tags ?? []).map((tag) => `#${tag} `)}
        </Typography>
      </Details>
      <Typography gutterBottom variant="h5" component="h2" style={{ padding: '0 20px' }}>
        {post.title}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>
      <CardActionsStyled>
        <Button
          size="small"
          color="primary"
          disabled={!user}
          onClick={() => dispatch(likePost(post._id, setError))}
        >
          <Likes likes={likes} hasLiked={hasLiked} />
        </Button>
        <Button
          size="small"
          color="primary"
          aria-label="delete memory"
          onClick={() => dispatch(deletePost(post._id, setError)).then((ok) => { if (ok) onDeleted?.(); })}
        >
          <DeleteIcon fontSize="small" />&nbsp;Delete
        </Button>
      </CardActionsStyled>
      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </StyledCard>
  );
}

export default Post;
