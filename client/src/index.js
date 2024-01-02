import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Home from './component/Home';
import { createBrowserRouter,RouterProvider,Route,Link} from "react-router-dom";
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import CheckLogin from './component/Display'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "SignIn",
    element: <SignIn/>
  },
  {
    path: "SignUp",
    element: <SignUp/>
  },
  {
    path: "Display",
    element: <CheckLogin/>
  },
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

