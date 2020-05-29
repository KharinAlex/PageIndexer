import {SEARCH_GET_PAGE_COUNT, SEARCH_START, SEARCH_MORE, SEARCH_SUCCESS, SEARCH_FAIL} from '../actions/action_types';

const initialState = {
  isSucceeded: false,
  isFailed: false,
  isSearching: false,
  errMsg: null,
  data: [
  ],
  pages: 0,
  offset: 0,
};

export function searchBarReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_GET_PAGE_COUNT:
      return {
        ...state,
        pages: action.pages,
      };
    case SEARCH_FAIL:
      return {
        ...state,
        isFailed: action.isFailed,
        errMsg: action.errMsg,
      };

    case SEARCH_START:
      return {
        ...state,
        isSearching: action.isSearching,
      };

    case SEARCH_MORE:
      return {
        ...state,
        isSucceeded: action.isSucceeded,
        offset: state.offset + 10,
        data: [
          ...state.data,
          ...action.data,
        ],
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        isSucceeded: action.isSucceeded,
        offset: 10,
        data: [
          ...action.data,
        ],
      };

    default:
      return state;
  }
}
