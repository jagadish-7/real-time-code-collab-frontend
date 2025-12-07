import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Services = () => {
    return (
        <>

            <Navbar />
            <div className="services-section">
                <div className="services-section-heading">
                    <h2>Services</h2>
                </div>

                <div className="services-content">
                    <div className="services-cards">
                        <h3>Real-Time Code Collaboration</h3>
                        <p>Collaborate seamlessly with your team in real-time. Our platform allows multiple users to work on the same code simultaneously, providing instant updates and reducing the friction of version control.</p>
                    </div>


                    <div className="services-cards">
                        <h3>Compiler And Code Editor</h3>
                        <p>Write, edit, and run your code with our integrated compiler and code editor. Supporting a wide range of programming languages, our editor offers syntax highlighting and error detection features.</p>
                    </div>


                    <div className="services-cards">
                        <h3>Real-Time Chat And Whiteboard</h3>
                        <p>Communicate and brainstorm effectively with our built-in real-time chat and whiteboard features. Discuss ideas, share code snippets, and draw diagrams collaboratively.</p>
                    </div>



                    <div className="services-cards">
                        <h3>Project Management</h3>
                        <p>Organize your projects efficiently with our project management tools. Create and manage projects, set milestones, and track progress with ease. Our platform provides a clear overview of your project status.</p>
                    </div>

                    <div className="services-cards">
                        <h3>Task Management</h3>
                        <p>Keep your tasks organized and prioritize your workload with our task management system. Assign tasks to team members, set deadlines, and monitor progress in real-time. It ensure that every task is completed on time.</p>
                    </div>


                </div>
            </div>

            <Footer />

        </>
    )
}

export default Services