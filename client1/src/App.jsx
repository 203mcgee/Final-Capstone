import React from 'react'
import { BrowserRouter, useParams, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import './index.css'
import HomePage from './pages/HomePage';
import Projects from './pages/Projects';
import ExperienceSkills from './pages/ExperienceSkills';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';

// import  ThemeProvider  from './components/ThemeProvider';

function App() {
  let { id } = useParams();
  return (
  <>
      {/* <ThemeProvider> */}
        <header>
        <h1 className='text-center text-2xl font-bold mb-1'>Welcome to my Portfolio!</h1>
          <div>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Navbar />
              <Hero />
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/projects' element={<Projects />} />
                <Route path='/projects/:id' element={<Projects />} />
                <Route path='/experience' element={<ExperienceSkills />} />
                <Route path='/contact' element={<Contact />} />
              </Routes>
              
              <Footer />
            </BrowserRouter>
          </div>
        </header>

       

      {/* </ThemeProvider> */}
  
  </>
  )
}

export default App;
