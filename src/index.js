import React from "react";
import App from "./App";
import AuthProvider from "./components/AuthProvider";
import { CssBaseline } from "@mui/material";

import { createRoot } from 'react-dom/client';

import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <CssBaseline />
    <App />
  </AuthProvider>,
);
