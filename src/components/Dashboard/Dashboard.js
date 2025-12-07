import React, { useEffect, useState } from 'react';
import projectService from '../../services/projectService';
import authService from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';



const Dashboard = (props) => {
  const [currentuser, setCurrentUser] = useState("");
  const [projects, setProjects] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);
    };

    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        setCurrentUser("User not found");
      }
      else {
        setCurrentUser(user);
      }

    }

    fetchProjects();
    fetchUser();
  }, []);


  const handleDeleteProject = async (projectId) => {
    const p = prompt("Are you sure, you want to delete this project? Type yes");
    if (p) {


      await projectService.deleteProject(projectId);
      setProjects(projects.filter(project => project._id !== projectId));
    }
  };

  const navigateToProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };


  console.log("projects: ", projects);




  return (
    <>

      <section className="home-section bg-black">
        <div className="home-content">
          <i style={{ color: "white" }} className='bx bx-menu bx-sm' onClick={props.handleClick}></i>
          <span style={{ color: "white" }} className="text"></span>
        </div>


        <div className="dash-all-content">

          <div className="create-project-heading">
            <h3>Recent Projects</h3>
            <hr className='horizontal-line' />
          </div>



          <div className="parent-container">

            {projects.length === 0 ?

              <div className="no-projects">
                <p>You have not created any project yet.  <Link to="/dashboard/create-project">Create here</Link></p>

              </div>

              :



              <div className="recent-projects">
                <div className="dash-projects-list">
                  {



                    projects.slice(0, 8).map((project) => (
                      <div className='list-item' key={project._id}>
                        <div className="list-item-text">
                          <h4>{project.name.split(" ").slice(0, 9).join(" ")}</h4>
                          <p>{project.description.split(" ").slice(0, 20).join(" ")} .......</p>
                          <span>{new Date(project.deadline).toLocaleDateString()} <b style={{ color: "white", fontWeight: "500" }}>// {project.importance}</b></span>
                        </div>

                        <div className="list-item-btn">
                          <button className='open-btn' onClick={() => navigateToProject(project._id)}>View</button>
                          <i class='bx bxs-trash' onClick={() => handleDeleteProject(project._id)} ></i>
                        </div>
                      </div>
                    ))


                  }


                </div>

              </div>

            }



          </div>

        </div>


      </section>



    </>
  );
};

export default Dashboard;
