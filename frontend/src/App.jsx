import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import SLoginSignup from './SLoginSignup';
import HeaderLogin from './HeaderLogin';

import Home from './Home';
import ProblemsList from './ProblemsList';
import Contribute from './Contribute';
import ProblemDetails from './ProblemDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SLoginSignup/>} />
        <Route path="/signup" element={<LoginSignup/>} />
        {/* getting problems page */}
        <Route path='/problems' element={<ProblemsList/>} />
        {/* posting problems page */}
        <Route path="/problems_post" element={<Contribute/>} />

        {/* getting particular problem */}
        <Route path="/problems/:id" element={<ProblemDetails/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
