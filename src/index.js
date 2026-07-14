import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BookProvider } from "./context/BookContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

    <React.StrictMode>

        <BookProvider>

            <App />

        </BookProvider>

    </React.StrictMode>

);