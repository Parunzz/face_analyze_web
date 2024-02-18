import React from 'react';
import Home from './component/Home';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Camera';
import Members from './component/Members';
import Dashboard from './component/Dashboard';
import AddMember from './component/AddMember';
import History from './component/History.jsx';
import Detect from './component/Detect';
import WebcamCapture from './component/CCTV1s.jsx';
import MemberDetail from './component/MemberDetail';
import ResponsiveAppBar from './component/ResponsiveAppBar.jsx'
<<<<<<< HEAD
import Menu from './component/Menu.jsx';
import Sidebar from './component/Sidebar.jsx';
=======
import Menu from './component/Menu.jsx'
import Kiosks from './component/Kiosks.jsx'
>>>>>>> b6c35c11f28a45b631354e690b0209e8a8967d0d

function App() {

  return (
    <BrowserRouter>
    <Sidebar />
      <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
<<<<<<< HEAD
          {/* <Route path='/Camera' element={<Camera />} /> */}
          <Route path='/Camera' element={<Detect />} />
          <Route path='/Member' element={<Member />} />
=======
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Members' element={<Members />} />
>>>>>>> b6c35c11f28a45b631354e690b0209e8a8967d0d
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
