import { createContext, useReducer } from 'react';

export const ReviewsContext = createContext();

const initialState = {
  reviews: [],
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_REVIEWS_SUCCESS':
      return {
        ...state,
        reviews: action.payload,
        loading: false,
      };
    case 'GET_REVIEWS_ERROR':
      return {
        ...state,
        reviews: [],
        loading: false,
        error: action.payload,
      };
    case 'ADD_REVIEW_SUCCESS':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
        loading: false,
        isAdded: true,
      };
    default:
      return state;
  }
};

export const ReviewsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchReviews(hotelId) {
    try {
      const data = await fetch(
        `https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Editon/hotels/${hotelId}/reviews`,
      );
      const result = await data.json();

      if (result) {
        dispatch({ type: 'GET_REVIEWS_SUCCESS', payload: result });
      }
    } catch (e) {
      dispatch({ type: 'GET_REVIEWS_ERROR', payload: e.message });
    }
  }

  async function addReview({ hotelId, title, description, rating }) {
    const reviewId = Math.floor(Math.random() * 100);

    try {
      const data = await fetch(
        `https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Editon/reviews`,
        {
          method: 'POST',
          body: JSON.stringify({
            id: reviewId,
            hotelId,
            title,
            description,
            rating,
          }),
        },
      );
      const result = await data.json();

      if (result) {
        dispatch({
          type: 'ADD_REVIEW_SUCCESS',
          payload: {
            id: reviewId,
            hotelId,
            title,
            description,
            rating,
          },
        });
      }
    } catch {}
  }

  return (
    <ReviewsContext.Provider value={{ ...state, fetchReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export default ReviewsContext;
