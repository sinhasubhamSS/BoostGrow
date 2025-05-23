
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import todoReducer from "./todoSlice";
import socketReducer from "./socketSlice"
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import messageReducer from "./messageSlice"
import friendReducer from "./friendSlice"
import postReducer from "./postSlice"
import { enableMapSet } from 'immer';
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "friend"], // ✅ Sirf `user` state persist hogi
};
enableMapSet();
const rootReducer = combineReducers({
    user: userReducer,
    todo: todoReducer,
    message: messageReducer,
    socket: socketReducer,
    friend: friendReducer,
    post: postReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
