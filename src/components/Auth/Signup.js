import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../HomeComponents/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../HomeComponents/Footer';

const Signup = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();




  const handleSignupErrors = () => {
    if (firstname === '' && lastname === '' && email === '' && password === '') {
      toast.error("Please fill all the fields");
      return false;
    }
    else if (firstname === '') {
      toast.error('Please enter first name')
      return false;
    }
    else if (lastname === '') {
      toast.error("Please enter last name")
    }
    else if (email === '') {
      toast.error("Please enter email");
      return false;
    }
    else if (password === '') {
      toast.error("Please enter password")
      return false;
    }
    else if (password.length < 6) {
      toast.error("Password must be atleast 6 characters");
      return false;
    }
    else {
      return true;
    }
  }




  const handleSignup = async (e) => {
    e.preventDefault();
    if (!handleSignupErrors()) {
      return;
    }
    try {
      await authService.signup(firstname, lastname, email, password);

      toast.success("Registered successfully");

      setTimeout(() => {
        navigate('/login');
      }, 3000);


    } catch (error) {
      if (error.response.data.userExists === true) {
        toast.error("User Already Exists. Please login");
      }
      console.log("User Already Exists");
    }
  };

  return (

    <>

      <Navbar />

      <div className='container-box'>

        <div className="auth-form">

          <h2>Welcome! Register Here</h2>


          <form className="form-input" onSubmit={handleSignup}>
            <input type="text" placeholder="Name" value={firstname} onChange={(e) => setFirstName(e.target.value)}
            />
            <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastName(e.target.value)}
            />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='auth-btn' type="submit">Signup</button>
          </form>

          <div className="signup-navigate">
            <p>Already have an account ? <a href="/login">Login here</a></p>
          </div>

        </div>

      </div>


      <Footer />

      <Toaster
        position="top-center"
        reverseOrder={true}
      />

    </>
  );
};

export default Signup;
