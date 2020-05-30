import * as actions from './action_types';
import {sendRequest, handleErrors} from './fetch_utils';


export function startIndexing(url, options) {
  return (dispatch) => {
    dispatch(indexTaskStart({isIndexing: true}));
    dispatch(indexTaskFail({isFailed: false, errMsg: ''}));
    dispatch(indexTaskSuccess({isSucceeded: false}));

    sendRequest(url, options)
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then((data) => {
          dispatch(indexTaskStart({isIndexing: false}));
          dispatch(indexTaskSuccess({isSucceeded: true}));
        })
        .catch((err) => {
          dispatch(indexTaskStart({isIndexing: false}));
          dispatch(indexTaskFail({isFailed: true, errMsg: `${err}`}));
        });
  };
}

export function indexTaskStart({isIndexing}) {
  return {
    type: actions.INDEX_TASK_START,
    isIndexing,
  };
}


export function indexTaskSuccess({isSucceeded}) {
  return {
    type: actions.INDEX_TASK_SUCCESS,
    isSucceeded,
  };
}

export function indexTaskFail({isFailed, errMsg}) {
  return {
    type: actions.INDEX_TASK_FAIL,
    isFailed,
    errMsg,
  };
}
