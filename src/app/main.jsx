import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import CoreProvider from "../core/CoreProvider";
import FeatureProvider from "../features/FeatureProvider";

import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CoreProvider>
    <FeatureProvider>
      <App />
    </FeatureProvider>
  </CoreProvider>
);
