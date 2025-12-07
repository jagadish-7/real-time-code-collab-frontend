import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import Navbar from '../../HomeComponents/Navbar';
import toast, { Toaster } from "react-hot-toast";
import Footer from '../../HomeComponents/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      sessionStorage.setItem('redirectUrl', redirectUrl);
      console.log("Session storage redirect URL is set!");
    }
  }, [location]);



  const handleLoginErrors = () => {
    if (email === '' && password === '') {
      toast.error("Please enter email and password");
      return false;
    }
    if (email === '') {
      toast.error("Please enter email");
      return false;
    }
    else if (password === '') {
      toast.error("Please enter password")
      return false;
    }
    else {
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleLoginErrors()) {
      return;
    }

    try {
      await authService.login(email, password);

      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
      sessionStorage.removeItem('redirectUrl');

      toast.success("Login Successfull");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    } catch (error) {
      console.log('Login failed', error);
      if (error.response.data.success === false) {
        toast.error("Please check your credintials");
        return;
      }
    }
  };





  return (

    <>

      <Navbar />

      <div className="container-box">
        <div className="auth-form">

          <h2>Welcome! Login Here</h2>

          <form className='form-input' onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button className='auth-btn' type="submit">Login</button>
          </form>

          <div className="login-navigate">
            <p>Don't have an account ? <a href="/signup">Register here</a></p>
          </div>
        </div>
      </div>


      <Toaster
        position="top-center"
        reverseOrder={true}
      />


      <Footer />
    </>
  );
};


export default Login;
