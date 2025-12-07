// src/components/ThankYou.js

import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div>
      <h2>Thank you for using our platform! You have ended the task</h2>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default ThankYou;
