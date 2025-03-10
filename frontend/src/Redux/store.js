
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import todoReducer from "./todoSlice";
import socketReducer from "./socketSlice"
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import messageReducer from "./messageSlice"
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"], // ✅ Sirf `user` state persist hogi
};

const rootReducer = combineReducers({
    user: userReducer,
    todo: todoReducer,
    message: messageReducer,
    socket: socketReducer,
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
