import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Avatar from 'react-avatar';



const Sidebar = () => {


  const [sidebarClosed, setSidebarClosed] = useState(true); // Initial state set to true
  const handleSidebarClick = () => {
    setSidebarClosed(!sidebarClosed);
  };



  return (
    <>

      <div className={`sidebar ${sidebarClosed ? '' : 'close'}`}>
        <div className="logo-details">
          {/* <div className="profile-image" style={{ backgroundImage: `url(${ProfileImg})`, padding: '22px' }}>
          </div> */}
          <span className="logo_name"> <div className='logo-icon'></div> Elit</span>
        </div>

        <ul className="nav-links">

          <li>
            <div className="iocn-link">
              <Link to="/dashboard">
                <i className='bx bx-home'></i>
                <span className="link_name">Dashboard</span>
              </Link>

            </div>
          </li>




          <li>
            <Link to="/dashboard/create-project">
              <i class='bx bxs-file-pdf'></i>
              <span className="link_name">Projects</span>
            </Link>
          </li>


          <li>
            <Link to="/dashboard/compiler">
              <i class='bx bx-code-alt'></i>
              <span className="link_name">Compiler</span>
            </Link>
          </li>


          <li>
            <Link to="/dashboard/setting">
              <i class='bx bxs-contact'></i>
              <span className="link_name">Setting</span>
            </Link>
          </li>

        </ul>
      </div>



      <Dashboard handleClick={handleSidebarClick} />


    </>
  )
}

export default Sidebar