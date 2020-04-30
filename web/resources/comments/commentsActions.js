/**
 * All Task CRUD actions
 *
 * Actions are payloads of information that send data from the application
 * (i.e. Yote server) to the store. They are the _only_ source of information
 * for the store.
 *
 * Comment: In Yote, we try to keep actions and reducers dealing with CRUD payloads
 * in terms of 'item' or 'items'. This keeps the action payloads consistent and
 * aides various scoping issues with list management in the reducers.
 */

// import api utility
import apiUtils from "../../global/utils/api";

export const GET_COMMENTS_REQUEST = "GET_COMMENTS_REQUEST";
export const GET_COMMENTS_SUCCESS = "GET_COMMENTS_SUCCESS";
export const GET_COMMENTS_ERROR = "GET_COMMENTS_ERROR";
export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_ERROR = "ADD_COMMENT_ERROR";

export function getCommentsRequest() {
  return {
    type: GET_COMMENTS_REQUEST,
  };
}

export function getCommentsSuccess(payload) {
  return {
    type: GET_COMMENTS_SUCCESS,
    payload,
  };
}

export function getCommentsError(error) {
  return {
    type: GET_COMMENTS_ERROR,
    error,
  };
}

export function addCommentRequest() {
  return {
    type: ADD_COMMENT_REQUEST,
  };
}

export function addCommentSuccess(payload) {
  return {
    type: ADD_COMMENT_SUCCESS,
    payload,
  };
}

export function addCommentError(error) {
  return {
    type: ADD_COMMENT_ERROR,
    error,
  };
}

export function fetchComments(id) {
  return (dispatch) => {
    dispatch(getCommentsRequest());
    return apiUtils
      .callAPI(`/api/notes/by-_task/${id}`)
      .then((json) => dispatch(getCommentsSuccess(json)))
      .catch((err) => dispatch(getCommentsError(err)));
  };
}

export function addComment(data, cb) {
  return (dispatch) => {
    dispatch(addCommentRequest());
    return apiUtils
      .callAPI(`/api/notes`, "POST", data)
      .then((json) => {
        dispatch(addCommentSuccess(json));
        cb();
      })
      .catch((err) => dispatch(addCommentError(err)));
  };
}
