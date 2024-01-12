import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Home from './component/Home';
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Carmera';
import Member from './component/Member';
import AddMember from './component/AddMember';

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
    path: "Camera",
    element: <Camera/>
  },
  {
    path: "Member",
    element: <Member/>
  },
  {
    path: "AddMember",
    element: <AddMember/>
  },
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

