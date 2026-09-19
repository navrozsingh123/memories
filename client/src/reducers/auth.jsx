import { AUTH, LOGOUT } from '../constants/actionTypes';

const storedProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('profile'));
  } catch {
    localStorage.removeItem('profile');
    return null;
  }
};

const authReducer = (state = { authData: storedProfile() }, action) => {
  switch (action.type) {
    case AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.removeItem('profile');
      return { ...state, authData: null };
    default:
      return state;
  }
};

export default authReducer;
