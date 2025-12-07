import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import authService from '../services/authService';


const Navbar = () => {


  const [currentuser, setCurrentuser] = useState();
  useEffect(() => {

    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        setCurrentuser(null);
      }
      else {
        setCurrentuser(user);
      }

    }

    fetchUser();
  }, []);



  console.log("CurrentUser: ", currentuser)


  return (
    <>

      {currentuser ?
        <div className='top-navbar'>
          Welcome,
            {
             currentuser.firstname
            }
        </div>
        : ""}

      <nav className="navbar">
        <div className="left">
          <h1 className="logo"><Link to="/"> <div className='logo-icon'></div> Elit</Link></h1>
        </div>

        <div className="right">
          <ul className="nav-items">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/compiler">Compiler</Link></li>

            {
              !currentuser ?
                <div className='nav-items-btn'>

                  <li className='login-button'><Link className='anc' to="/login">Login</Link></li>
                  <li className='signup-button'><Link to="/signup">Register</Link></li>
                </div>
                :
                <div>
                  <li className='signup-button'><Link to="/dashboard">Dashboard</Link></li>
                </div>


            }

          </ul>
        </div>

      </nav>



    </>
  )
}

export default Navbar