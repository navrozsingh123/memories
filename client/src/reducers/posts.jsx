import {
  FETCH_ALL, FETCH_ERROR, CREATE, UPDATE, DELETE, LIKE, START_LOADING, END_LOADING,
} from '../constants/actionTypes';

const initialState = {
  isLoading: true,
  error: '',
  posts: [],
  currentPage: 1,
  numberOfPages: 1,
  total: 0,
};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true, error: '' };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ERROR:
      return { ...state, error: action.payload, posts: [] };
    case FETCH_ALL:
      return {
        ...state,
        error: '',
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        total: action.payload.total,
      };
    case CREATE:
      // The new post may belong on another page once the server re-paginates,
      // so only the running total is adjusted here; Home refetches the page.
      return { ...state, total: state.total + 1 };
    case UPDATE:
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post),
      };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        total: Math.max(0, state.total - 1),
      };
    default:
      return state;
  }
}
