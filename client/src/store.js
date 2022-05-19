import { configureStore, applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const store = configureStore({
	reducer: rootReducer,
	middleware: applyMiddleware(...middleware),
	devTools: true,
});
