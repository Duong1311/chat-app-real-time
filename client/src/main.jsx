// Author: TrungQuanDev: https://youtube.com/@trungquandev
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";

// Config react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config react-router-dom with BrowserRouter
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";
import { io } from "socket.io-client";
import { API_ROOT } from "./utils/constants.js";
export const socket = io(API_ROOT);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer position="bottom-left" theme="colored" />
  </BrowserRouter>
);
