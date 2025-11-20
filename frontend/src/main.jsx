import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// If you installed bootstrap via npm, uncomment the line below:
// import 'bootstrap/dist/css/bootstrap.min.css';

// If you see React Router future-flag warnings (optional):
// <BrowserRouter
//   future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
// >

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
