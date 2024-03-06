import React from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import Kiosks from './kiosk/Kiosks.jsx'
function App() {

  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Kiosks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
