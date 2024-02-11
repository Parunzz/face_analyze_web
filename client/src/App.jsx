import React from 'react';
import Home from './component/Home';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Carmera';
import Member from './component/Member';
import AddMember from './component/AddMember';
import Detect from './component/Detect';
import WebcamCapture from './component/WebcamCapture';
import MemberDetail from './component/MemberDetail';
<<<<<<< HEAD
import Dashboard from './component/Dashboard';

=======
import ResponsiveAppBar from './component/ResponsiveAppBar.jsx'
import Menu from './component/Menu.jsx';
>>>>>>> 7121b94d1f9387d83d1038e2cad33c1b84932ef8
function App() {

  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Member' element={<Member />} />
          <Route path='/member/:pid' element={<MemberDetail />} />
          <Route path='/AddMember' element={<AddMember />} />
          <Route path='/Kiosk' element={<Detect />} />
<<<<<<< HEAD
          <Route path='/CCTV1' element={<WebcamCapture />} />
          <Route path='/Dashboard' element={<Dashboard />} />
=======
          <Route path='/CCTV1' element={<WebcamCapture />} />  
>>>>>>> 7121b94d1f9387d83d1038e2cad33c1b84932ef8
      </Routes>
    </BrowserRouter>
  )
}

export default App
