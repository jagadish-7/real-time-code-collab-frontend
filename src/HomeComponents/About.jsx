import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const About = () => {
    return (
        <>

            <Navbar />

            <div className="about-section">
                <div className="about-heading">
                    <h2>About Us</h2>
                </div>
                <div className="about-content">

                    <p>At Elit, we are passionate about revolutionizing the way developers collaborate and code together. Our platform is designed to break down the barriers of remote work by providing real-time collaboration tools that foster seamless teamwork and innovation. Our journey began with a vision to create an environment where developers can work together in real-time, regardless of their geographical location. We understand the challenges of remote collaboration and have built our platform to address these pain points, ensuring that teams can communicate, code, and manage projects effortlessly.</p>

                    <p>Our mission is to empower developers by providing them with the tools they need to collaborate effectively. From our real-time code editor and integrated compiler to our dynamic chat and whiteboard features, every aspect of our platform is designed with the user in mind. We strive to create a cohesive experience that enhances productivity and fosters creativity.</p>


                    <p>We believe in the power of teamwork and the potential of collaborative coding. Our platform is more than just a tool; it's a community where developers can connect, share ideas, and build amazing projects together. We are committed to continuous improvement and innovation, always listening to our users and evolving to meet their needs.</p>


                    <p>Together, let's build the future of collaborative coding.</p>

                    <p>Initiative by <b> Shivani, Vaibhavi, and Sanika </b>.... </p>



                </div>

            </div>



            <Footer />



        </>
    )
}

export default About