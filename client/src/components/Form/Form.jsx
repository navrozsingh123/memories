import { useState } from 'react';
import { TextField, Button, Typography, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { buttonSubmitStyle, fileInputStyle, StyledPaper, StyledForm } from './Styles';
import { createPost, updatePost } from '../../actions/posts';

const emptyPost = { title: '', message: '', tags: '', selectedFile: '' };

const Form = ({ currentId, setCurrentId, onCreated }) => {
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null);
  const user = useSelector((state) => state.auth.authData);
  const dispatch = useDispatch();

  // Home keys this component by currentId, so picking a memory to edit remounts
  // the form and this initialiser seeds it. Tags stay a plain string while
  // editing so commas type naturally; they're split into an array on submit.
  const [postData, setPostData] = useState(() =>
    post ? { ...post, tags: (post.tags ?? []).join(',') } : emptyPost);
  const [error, setError] = useState('');

  const clear = () => {
    setCurrentId(null);
    setPostData(emptyPost);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...postData,
      tags: postData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setError('');

    const action = currentId
      ? updatePost(currentId, payload, setError)
      : createPost(payload, setError);

    // Only reset once the request succeeds, so a rejected edit keeps the
    // user's input instead of silently discarding it.
    dispatch(action).then((ok) => {
      if (!ok) return;
      clear();
      // A new memory may re-paginate the feed; let Home reload it.
      if (!currentId) onCreated?.();
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPostData((prev) => ({ ...prev, selectedFile: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  if (!user?.result?.name) {
    return (
      <StyledPaper>
        <Typography variant="h6" align="center">
          Please sign in to create your own memories and like other people&apos;s.
        </Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <StyledForm autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6">
          {currentId ? 'Editing a Memory' : 'Creating a Memory'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          minRows={3}
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (comma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
        />
        <div style={fileInputStyle}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button
          style={buttonSubmitStyle}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
          Clear
        </Button>
      </StyledForm>
    </StyledPaper>
  );
};

export default Form;
