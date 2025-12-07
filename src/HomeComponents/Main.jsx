import React from 'react'
import { useNavigate } from 'react-router-dom'

const Main = () => {


  const navigate = useNavigate();
  const handleRegister = ()=>{
    navigate("/signup");
  }
  return (
    <>


      <section className="section-1">
        <div className="section1-content">
          <h1 className='main-heading'>Real Time Code Collaboration System</h1>
          <h3 className='main-caption'>Code Editor, Compiler, And much much more...</h3>
        </div>
        <div className="section-1-btn">
          <button onClick={handleRegister}>Register Today</button>
        </div>
      </section>

      <section className="section-2">

      </section>

      <section className="section-3">

      </section>




    </>
  )
}

export default Main