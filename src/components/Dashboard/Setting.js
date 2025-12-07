import React, { useEffect, useState } from 'react';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';

const Setting = (props) => {
    const [currentUser, setCurrentUser] = useState({});
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authService.getCurrentUser();
            if (!user) {
                setCurrentUser("User not found");
            } else {
                setCurrentUser(user);
                setFormData({
                    firstname: user.firstname || '',
                    lastname: user.lastname || '',
                    email: user.email || '',
                    password: '',
                    confirmPassword: '',
                });
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };



    const handleUpdateDetails = () => {
        if (formData.firstname === '') {
            toast.error("Please fill First name");
            return false;
        }
        else if (formData.lastname === '') {
            toast.error("Please fill Last name");
            return false;
        }
        else if (formData.email === '') {
            toast.error("Please fill Email");
            return false;
        }
        
        else if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!handleUpdateDetails()) {
            return;
        }
        // Add password match validation if needed


        try {
            await authService.updateUser(formData);

            toast.success('User details updated successfully!');
        } catch (error) {
            console.log(error);
            alert('Failed to update user details. Try again after some time');
        }
    };

    return (

        <>
            <section className="home-section bg-black">
                <div className="home-content">
                    <i style={{ color: "white" }} className='bx bx-menu bx-sm' onClick={props.handleClick}></i>
                    <span style={{ color: "white" }} className="text"></span>
                </div>

                <div className="dash-all-content">
                    <div className="create-project-heading">
                        <h3>Setting</h3>
                        <hr className='horizontal-line' />
                    </div>

                    <div className="user-settings">
                        <form className='user-details-form' onSubmit={handleSubmit}>

                            <div className="left-details">

                                <div className="input-box">

                                    <label htmlFor="firstname">First name</label>
                                    <input type="text" id='firstname' value={formData.firstname} onChange={handleChange} />

                                </div>

                                <div className="input-box">
                                    <label htmlFor="lastname">Last name</label>
                                    <input type="text" id='lastname' value={formData.lastname} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                    <label htmlFor="email">Email Id</label>
                                    <input type="email" id='email' value={formData.email} onChange={handleChange} disabled />
                                </div>


                                <div className="user-details-buttons">

                                    <button type='submit' className='update-details-btn'>Update</button>
                                    <span className='logout-btn' onClick={authService.logout}>Logout</span>

                                </div>

                            </div>

                            <div className="right-details">


                                <div className="input-box">
                                    <label htmlFor="password">New Password</label>
                                    <input type="password" id='password' value={formData.password} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
                                </div>

                            </div>



                        </form>
                    </div>
                </div>
            </section>


            <Toaster position="top-right" />


        </>
    );
};

export default Setting;
