import * as api from '../api';
import { AUTH } from '../constants/actionTypes';

const errorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const signin = (formData, navigate, onError) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    navigate('/posts');
  } catch (error) {
    onError?.(errorMessage(error, 'Sign in failed. Please try again.'));
  }
};

export const signup = (formData, navigate, onError) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    navigate('/posts');
  } catch (error) {
    onError?.(errorMessage(error, 'Sign up failed. Please try again.'));
  }
};

export const googleSignin = (credential, navigate, onError) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn(credential);
    dispatch({ type: AUTH, data });
    navigate('/posts');
  } catch (error) {
    onError?.(errorMessage(error, 'Google sign in failed.'));
  }
};
