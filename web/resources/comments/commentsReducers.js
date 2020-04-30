import * as Actions from "./commentsActions";

/**
 * Primary comments reducer -
 */
const initState = {
  list: [],
  isLoading: false,
  error: null,
};
const comments = (state = initState, action) => {
  /**
   * Listen for the actions and respond accordingly.
   */
  let nextState;
  switch (action.type) {
    case Actions.GET_COMMENTS_REQUEST: {
      nextState = {
        ...state,
        isLoading: true,
      };
      break;
    }
    case Actions.GET_COMMENTS_SUCCESS: {
      nextState = {
        ...state,
        list: action.payload.notes,
        isLoading: false,
      };
      break;
    }
    case Actions.GET_COMMENTS_ERROR: {
      nextState = {
        ...state,
        error: action.error,
        isLoading: false,
      };
      break;
    }
    case Actions.ADD_COMMENT_REQUEST: {
      nextState = {
        ...state,
        isLoading: true,
      };
      break;
    }
    case Actions.ADD_COMMENT_SUCCESS: {
      const newList = [...state.list];
      newList.push(action.payload.note);
      nextState = {
        ...state,
        list: newList,
        isLoading: false,
      };
      break;
    }
    case Actions.ADD_COMMENT_ERROR: {
      nextState = {
        ...state,
        error: action.error,
        isLoading: false,
      };
      break;
    }
    default: {
      nextState = state;
      break;
    }
  }
  return nextState;
};

export default comments;
