import {combineReducers} from 'redux';
import {searchBarReducer} from './search_bar_reducer';


let rootReducer = combineReducers({
  searchBarReducer,
});

export default rootReducer;
