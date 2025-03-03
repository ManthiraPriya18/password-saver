import rootReducer from './reducers/rootreducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
