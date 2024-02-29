import React from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Camera';
import Members from './component/Members';
import Member from './component/Member';
import Dashboard from './component/Dashboard';
import AddMember from './component/AddMember';
import History from './component/History.jsx';
import WebcamCapture from './component/CCTV1s.jsx';
import MemberDetail from './component/MemberDetail';
import Menu from './component/Menu.jsx'
import Kiosks from './component/Kiosks.jsx'
import TransactionDetail from './component/TransactionDetail.jsx';
function App() {

  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Members' element={<Members />} />
          <Route path='/Member' element={<Member />} /> 
          <Route path='/member/:pid' element={<MemberDetail />} />
          <Route path='/AddMember' element={<AddMember />} />
          <Route path='/History' element={<History />} />
          <Route path='/history/:Data_id' element={<TransactionDetail />} />
          <Route path='/Kiosks' element={<Kiosks />} />
          <Route path='/CCTV1s' element={<WebcamCapture />} />  
          <Route path='/Dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
