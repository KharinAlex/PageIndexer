import {INDEX_TASK_START, INDEX_TASK_SUCCESS, INDEX_TASK_FAIL} from '../actions/action_types';

const initialState = {
  isSucceeded: false,
  isFailed: false,
  isIndexing: false,
  errMsg: '',
};

export function indexBarReducer(state = initialState, action) {
  switch (action.type) {
    case INDEX_TASK_FAIL:
      return {
        ...state,
        isFailed: action.isFailed,
        errMsg: action.errMsg,
      };

    case INDEX_TASK_START:
      return {
        ...state,
        isIndexing: action.isIndexing,
      };

    case INDEX_TASK_SUCCESS:
      return {
        ...state,
        isSucceeded: action.isSucceeded,
      };

    default:
      return state;
  }
}
