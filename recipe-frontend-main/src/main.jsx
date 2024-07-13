import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Recipe from "./components/recipe/recipe.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/recipe/:id",
    element: <Recipe view />,
  },
  {
    path: "/recipe",
    element: <Recipe add />,
  },
  {
    path: "/recipe/:id/edit",
    element: <Recipe edit />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
