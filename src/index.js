import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Atual from './pages/atual';
import ErrorPage from './pages/error-page';
import Futuro from './pages/futuro';
import Historico from './pages/historico';
import NotFound from './pages/not-found';
import reportWebVitals from './reportWebVitals';
import Root from './routes/root';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Atual />,
      },
      {
        path: "historico",
        element: <Historico />,
      },
      {
        path: "futuro",
        element: <Futuro />,
      },
      {
        path: "**",
        element: <NotFound />,
      },
    ]
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
