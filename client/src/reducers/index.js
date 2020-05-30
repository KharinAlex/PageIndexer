import {combineReducers} from 'redux';
import {searchBarReducer} from './search_bar_reducer';
import {indexBarReducer} from './index_bar_reducer';

let rootReducer = combineReducers({
  searchBarReducer,
  indexBarReducer,
});

export default rootReducer;
