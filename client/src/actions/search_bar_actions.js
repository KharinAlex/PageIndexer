import * as actions from './action_types';
import {sendRequest, handleErrors} from './fetch_utils';

export function getPages(url, options) {
  return (dispatch) => {
    sendRequest(url, options)
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then((data) => {
          dispatch(serachPageCount({pages: data.pages}));
        })
        .catch((err) => {
          dispatch(searchFail({isFailed: true, errMsg: `${err}`}));
        });
  };
}


export function startSearch(url, params, options) {
  return (dispatch) => {
    dispatch(serachStart({isSearching: true}));
    dispatch(searchFail({isFailed: false, errMsg: ''}));

    sendRequest(`${url}?${params}`, options)
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then((data) => {
          dispatch(serachStart({isSearching: false}));
          if(params.includes('offset')) {
            dispatch(searchMore({isSucceeded: true, data}));
          }else{
            dispatch(searchSuccess({isSucceeded: true, data}));
          }
        })
        .catch((err) => {
          dispatch(serachStart({isSearching: false}));
          dispatch(searchFail({isFailed: true, errMsg: `${err}`}));
        });
  };
}
export function serachPageCount({pages}) {
  return {
    type: actions.SEARCH_GET_PAGE_COUNT,
    pages,
  };
}


export function serachStart({isSearching}) {
  return {
    type: actions.SEARCH_START,
    isSearching,
  };
}

export function searchMore({isSucceeded, data}) {
  return {
    type: actions.SEARCH_MORE,
    isSucceeded,
    data,
  };
}

export function searchSuccess({isSucceeded, data}) {
  return {
    type: actions.SEARCH_SUCCESS,
    isSucceeded,
    data,
  };
}

export function searchFail({isFailed, errMsg}) {
  return {
    type: actions.SEARCH_FAIL,
    isFailed,
    errMsg,
  };
}
