import * as api from '../api';
import {
  CREATE, UPDATE, DELETE, LIKE, FETCH_ALL, FETCH_ERROR, START_LOADING, END_LOADING,
} from '../constants/actionTypes';

const errorMessage = (error, fallback) => {
  if (error.response?.data?.message) return error.response.data.message;
  // No response at all means the request never landed — usually the API is down.
  if (!error.response) return 'Cannot reach the server. Is the API running?';
  return fallback;
};

export const getPosts = (page = 1) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
    return true;
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: errorMessage(error, 'Could not load memories.') });
    return false;
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const createPost = (post, onError) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
    return true;
  } catch (error) {
    onError?.(errorMessage(error, 'Could not create this memory.'));
    return false;
  }
};

export const updatePost = (id, post, onError) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
    return true;
  } catch (error) {
    onError?.(errorMessage(error, 'Could not update this memory.'));
    return false;
  }
};

export const deletePost = (id, onError) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
    return true;
  } catch (error) {
    onError?.(errorMessage(error, 'Could not delete this memory.'));
    return false;
  }
};

export const likePost = (id, onError) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
    return true;
  } catch (error) {
    onError?.(errorMessage(error, 'Could not like this memory.'));
    return false;
  }
};
