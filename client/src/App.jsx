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
    <Left />
      <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Members' element={<Members />} />
          <Route path='/member/:pid' element={<MemberDetail />} />
          <Route path='/AddMember' element={<AddMember />} />
          <Route path='/History' element={<History />} />
          <Route path='/Kiosks' element={<Kiosks />} />
          <Route path='/CCTV1s' element={<WebcamCapture />} />  
          <Route path='/Dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
