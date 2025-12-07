import React, { useState, useEffect } from 'react'
import toast, { Toaster } from "react-hot-toast";
import projectService from '../../services/projectService';
import { Link, useNavigate } from 'react-router-dom';

const CreateProject = (props) => {

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectImportance, setNewProjectImportance] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const date = new Date();
  let todaysDate = date.toLocaleDateString('en-ZA').split('/').join('-');

  // todaysDate = todaysDate.split('/').join('-');

  console.log(todaysDate);


  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);
    };



    fetchProjects();
  }, []);






  const handleDeleteProject = async (projectId) => {
    await projectService.deleteProject(projectId);
    setProjects(projects.filter(project => project._id !== projectId));
  };

  const navigateToProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };


  const handleCreateProjectErrors = () => {

    if (newProjectName === '' && newProjectDeadline === '' && newProjectTitle === '' && newProjectImportance === '' && newProjectDescription === '') {
      toast.error("Please fill all the required fields");
      return false;
    }
    else if (newProjectName === '') {
      toast.error("Please enter project name");
      return false;
    }
    else if (newProjectDeadline === '') {
      toast.error("Please enter deadline");
      return false;
    }
    else if (newProjectTitle === '') {
      toast.error("Please enter project title");
      return false;
    }
    else if (newProjectImportance === '') {
      toast.error("Please select the importance")
      return false;
    }
    else if (newProjectDescription === '') {
      toast.error("Please enter project description");
      return false;
    }
    

    return true;
  }

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!handleCreateProjectErrors()) {
      return;
    }


    const newProject = await projectService.createProject({ newProjectName, newProjectDeadline, newProjectTitle, newProjectImportance, newProjectDescription });

    console.log("newProject: ", newProject);

    if (newProject.projectExists) {
      toast.error("Project Already exists.");
      return;
    }


    if (newProject) {
      toast.success('Project Created Successfully. Redirecting')

    }

    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDeadline('');
    setNewProjectTitle('');
    setNewProjectImportance('');
    setNewProjectDescription('');


    setTimeout(() => {
      navigateToProject(newProject._id);
    }, 3500);


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
            <h3>Create New Project</h3>
            <hr className='horizontal-line' />
          </div>


          <div className="project-form">


            <form className='project-details-form' onSubmit={handleCreateProject}>

              <div className="left-details">

                <div className="input-box">
                  <label htmlFor="projectName">Project name<span className="required">*</span></label>
                  <input type="text" id='projectName' value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
                </div>

                <div className="input-box">
                  <label htmlFor="projectTitle">Project Title<span className="required">*</span></label>
                  <input type="text" id='projectTitle' value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} />
                </div>

                <div className="input-box">
                  <label htmlFor="description">Brief Description of Project<span className="required">*</span></label>
                  <textarea id='description' value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)}></textarea>
                </div>


                <div className="project-form-buttons">
                  <button type='submit' className='create-project-btn'>Create New Project</button>
                </div>

              </div>



              <div className="right-details">


                <div className="input-box">
                  <label htmlFor="deadline">Deadline<span className="required">*</span></label>
                  <input type="date" id='deadline' value={newProjectDeadline} onChange={(e) => setNewProjectDeadline(e.target.value)} min={todaysDate} max="2025-6-31" />
                </div>

                <div className="input-box">
                  <label htmlFor='importance'>Select Importance<span className="required">*</span></label>
                  <select
                    id='importance'
                    value={newProjectImportance}
                    onChange={(e) => setNewProjectImportance(e.target.value)}
                  >
                    <option value=''>Select</option>
                    <option value="Important" >Important</option>
                    <option value="Less Important">Less Important</option>
                    <option value="Not Important">Not Important</option>
                  </select>
                </div>

              </div>


            </form>
          </div>








          <div className="project-list">
            <div className="create-project-heading">
              <h3>All Created Projects</h3>
              <hr className='horizontal-line' />
            </div>



            <div className="parent-container create-project-container">

              {projects.length === 0 ?

                <div className="no-projects">
                  <p>You have not created any projects yet. </p>

                </div>

                :
                <div className="recent-projects">
                  <div className="dash-projects-list">
                    {projects.map((project) => (
                      <div className='list-item' key={project._id}>
                        <div className="list-item-text">
                          <h4>{project.name}</h4>
                          <p>{project.description.split(" ").slice(0, 20).join(" ")} .....</p>
                          <span>{new Date(project.deadline).toLocaleDateString()} <b style={{ color: "white", fontWeight: "500" }}>// {project.importance}</b></span>
                        </div>

                        <div className="list-item-btn">
                          <button className='open-btn' onClick={() => navigateToProject(project._id)}>View</button>
                          <i className='bx bxs-trash' onClick={() => handleDeleteProject(project._id)} ></i>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              }



            </div>


          </div>

        </div>


      </section>






      <Toaster
        position="top-right"
        reverseOrder={true}
      />


    </>
  )
}

export default CreateProject