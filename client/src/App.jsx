import React from 'react';
import Home from './component/Home';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Camera from './component/Carmera';
import Member from './component/Member';
import AddMember from './component/AddMember';
function App() {

  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Camera' element={<Camera />} />
          <Route path='/Member' element={<Member />} />
          <Route path='/AddMember' element={<AddMember />} />
          
      </Routes>
    </BrowserRouter>
  )
}

export default App
