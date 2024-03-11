import React from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Camera';
import Members from './component/Members';
import Dashboard from './component/Dashboard';
import AddMember from './component/AddMember';
import History from './component/History.jsx';
import MemberDetail from './component/MemberDetail';
import Menu from './component/Menu.jsx'
import Kiosks from './component/Kiosks.jsx'
import TransactionDetail from './component/TransactionDetail.jsx';
import Map from './component/Map.jsx';
<<<<<<< HEAD
import Test from './component/Test.jsx';

=======
import KiosksTest from './component/KiosksTest.jsx'
>>>>>>> 50347eff65a5136bad76c8dbdfb45ca0e089fbbf

function App() {

  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Members' element={<Members />} />
          <Route path='/member/:pid' element={<MemberDetail />} />
          <Route path='/AddMember' element={<AddMember />} />
          <Route path='/History' element={<History />} />
          <Route path='/history/:Data_id' element={<TransactionDetail />} />
          <Route path='/Kiosks' element={<Kiosks />} />
          <Route path='/Dashboard' element={<Dashboard />}/>
<<<<<<< HEAD
          <Route path='/Map/:pid' element={<Map />}/>
          <Route path='/Test' element={<Test/>}/>
=======
          <Route path='/Map' element={<Map />}/>
          <Route path='/KiosksTest' element={<KiosksTest />}/>
>>>>>>> 50347eff65a5136bad76c8dbdfb45ca0e089fbbf
      </Routes>
    </BrowserRouter>
  )
}

export default App
