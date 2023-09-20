import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './reducers/userReducer'
import storage from "redux-persist/lib/storage"; 

import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    user: userReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer
});

export default store;
export type State = ReturnType<typeof persistedReducer>
export const persister = persistStore(store);