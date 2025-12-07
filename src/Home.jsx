import React from 'react'
import Navbar from './HomeComponents/Navbar'
import Main from './HomeComponents/Main'
import './Homepage.css'
import Footer from './HomeComponents/Footer'


const Home = () => {






  return (
    <>

      <div className="main-wrapper-home-page">

        <Navbar />
        <div className="wrapper">

          <Main />


        </div>

        <Footer />

      </div>



    </>
  )
}

export default Home