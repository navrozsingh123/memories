import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
});

// Attach the stored token to every request so protected routes accept it.
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');

  if (profile) {
    try {
      const { token } = JSON.parse(profile);
      if (token) req.headers.Authorization = `Bearer ${token}`;
    } catch {
      localStorage.removeItem('profile');
    }
  }

  return req;
});

export const fetchPosts = (page = 1) => API.get(`/posts?page=${page}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const googleSignIn = (credential) => API.post('/users/google', { credential });
