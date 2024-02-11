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
import ResponsiveAppBar from './component/ResponsiveAppBar.jsx'
import Menu from './component/Menu.jsx';
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
          <Route path='/CCTV1' element={<WebcamCapture />} />  
      </Routes>
    </BrowserRouter>
  )
}

export default App
