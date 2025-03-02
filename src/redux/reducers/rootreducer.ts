import { combineReducers } from 'redux';
import userReducer from './userreducer';
const rootReducer = combineReducers({
    userData: userReducer,
});

export default rootReducer;