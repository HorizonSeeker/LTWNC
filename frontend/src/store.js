import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import {
  noteCreateReducer,
  noteDeleteReducer,
  noteListReducer,
  noteUpdateReducer,
} from "./reducers/notesReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userUpdateReducer,
} from "./reducers/userReducers";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  noteList: { notes: [], loading: false, error: null },
  noteCreate: { loading: false, success: false, error: null },
  noteDelete: { loading: false, success: false, error: null },
  noteUpdate: { loading: false, success: false, error: null },
  userRegister: userRegisterReducer,
  userUpdate: userUpdateReducer,
};

const store = configureStore({
  reducer: {
    noteList: noteListReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    noteCreate: noteCreateReducer,
    noteDelete: noteDeleteReducer,
    noteUpdate: noteUpdateReducer,
    userUpdate: userUpdateReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
