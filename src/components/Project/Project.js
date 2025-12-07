import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';

Modal.setAppElement('#root'); // Important for accessibility

const Project = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [particularProject, setParticularProject] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [newTaskImportance, setNewTaskImportance] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const [submittedTasks, setSubmittedTasks] = useState([]);


  //Get current date
  const date = new Date();
  let todaysDate = date.toLocaleDateString('en-ZA').split('/').join('-');

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await taskService.getTasks(projectId);
      setTasks(fetchedTasks);

      const fetchedSubmittedTasks = await taskService.getSubmittedTasks(projectId);
      setSubmittedTasks(fetchedSubmittedTasks);
    };

    const fetchProject = async () => {
      const particularP = await projectService.getOneProject(projectId);
      setParticularProject(particularP);
    };

    fetchTasks();
    fetchProject();
  }, [projectId]);


  const handleCreateTaskError = ()=>{
    
    if(newTaskName === "" && newTaskDescription === "" && expiryDate === "" && newTaskImportance === "")
    {
      toast.error("All fields are required.");
      return false;
    }
    if(newTaskName === "")
    {
      toast.error("Please fill task name");
      return false;
    }
    else if(expiryDate === "")
    {
      toast.error("Please fill expiry date.")
      return false;
    }
    else if(newTaskImportance === "")
    {
      toast.error("Please specify importance");
      return false;
    }
    else if(newTaskDescription === "")
    {
      toast.error("Please fill task description");
      return false;
    }

    

    return true;
    
  }

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if(!handleCreateTaskError())
    {
      return;
    }
    const newTask = await taskService.createTask(projectId, newTaskName, expiryDate, newTaskImportance, newTaskDescription);
    setTasks([...tasks, newTask]);


    if (newTask.taskExists) {
      toast.error("Task Already Exists.");
      return;
    }

    console.log("Tasks from project.js createTast function", tasks);
    console.log("newTask from project.js createTast function", newTask);

    setNewTaskName('');
    setExpiryDate('');
    setNewTaskImportance('');
    setNewTaskDescription('');

    toast.success("Task Created Successfully. Redirecting to task...");

    setTimeout(() => {

      closeModal();
      navigateToTask(newTask._id);

    }, 3500);

  };



  const handleDeleteTask = async (taskId) => {
    const deleted = await taskService.deleteTask(taskId, projectId);
    if (deleted.taskDeleted) {
      toast.success("Task Deleted Successfully");
    }
    setTasks(tasks.filter(task => task._id !== taskId));


  }

  const navigateToTask = (taskId) => {
    navigate(`task/${taskId}`);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = (e) => {
    setModalIsOpen(false);
  };






  ///Calculate the days remaining
  const calculateDaysRemaining = (expiryDate) => {
    const currentDate = new Date();
    const deadlineDate = new Date(expiryDate);
    const timeDifference = deadlineDate - currentDate;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const daysRemaining = calculateDaysRemaining(particularProject.deadline);






  const handleBack = () => {
    navigate('/dashboard');
  };



  // Close Sidebar and Close Home
  const [closeSide, setCloseSide] = useState('');
  const [homeClose, setHomeCLose] = useState('');
  const [bigModal, setBigModal] = useState('Modal');


  const closeHome = () => {
    if (homeClose === '') {
      setHomeCLose('close-home');
    } else setHomeCLose('');
  };
  const closeSidebar = () => {
    if (closeSide === '') setCloseSide('close');
    else setCloseSide('');

    if (bigModal === 'Modal')
      setBigModal('Modal-big-screen')
    else setBigModal('Modal');
    closeHome();
  };



  const getUniqueUserNames = (submittedByArray) => {
    const uniqueNames = new Set();

    submittedByArray.forEach(submission => {
      const fullName = `${submission.userFirstName}`;
      uniqueNames.add(fullName);
    });

    return Array.from(uniqueNames);
  };

  console.log("Submitted Tasks from Project.js: ", submittedTasks);


  return (
    <>
      <div className="dashboard-component">
        <div className={`dashboard-sidebar ${closeSide}`}>
          <div className="app-logo">
            <h2>DevHub</h2>
          </div>

          <div className="dash-project-info">
            <div className="project-info">

              <h4>{particularProject.name}</h4>
              <p className="project-info-deadline">
                {new Date(particularProject.deadline).toLocaleDateString()}
                {daysRemaining <= -1 ? <span style={{ color: "red", fontSize: "12px", lineHeight: "16px" }} > <b> - Expired {Math.abs(daysRemaining)} days before </b></span> : <span style={{ color: "yellow", fontSize: "12px" }} > - {daysRemaining} days remaining</span>}

              </p>
              <p className="project-info-importance">{particularProject.importance}</p>
              <div className="project-info-description">
                <h5>Description : </h5>
                <p>{particularProject.description}</p>
              </div>
            </div>

          </div>
          <div className="logout">
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>

        <div className={`dash-home-section ${homeClose}`}>
          <div className="dashboard-navbar">
            <div className="close-side-icon">
              <span className="menu-iocn">
                <i onClick={closeSidebar} className="bx bx-menu bx-sm"></i>
              </span>
            </div>

            <div className="user-profile">{/* <h3>User Name</h3> */}</div>
          </div>

          <div>
            <div className="create-task-component">
              <div className="create-project-heading">
                <h3>Create Tasks Here</h3>
                <hr className="horizontal-line" />
              </div>

              <div className="create-task-form">
                <button className='create-task-btn' onClick={openModal}>Create Task</button>
              </div>

              <div className="create-project-heading">
                <h3>Tasks</h3>
                <hr className="horizontal-line" />
              </div>

              <div className="parent-container">

                {tasks.length === 0 ?

                  <div className="no-projects">
                    <p>You have not yet created any task yet.</p>

                  </div>

                  :

                  <div className="recent-projects">
                    <div className="dash-projects-list">
                      {tasks.map((task) => (
                        <div className="list-item" key={task._id}>
                          <div className="list-item-text">
                            <h4 style={{ margin: "0" }}>{task.name.split(" ").slice(0, 3).join(" ")} ...</h4>
                            <span>
                              {new Date(task.expiryDate).toLocaleDateString()}{' '}
                              <b style={{ color: 'white', fontWeight: '500', marginBottom: "10px" }}></b>
                            </span>
                            <p style={{ marginTop: "5px", fontSize: "12px", color: "green", fontWeight: "700" }}>// {task.importance} task</p>
                            <p style={{ marginTop: "5px" }} >{task.description.split(" ").slice(0, 25).join(" ")} ......</p>
                          </div>

                          <div className="list-item-btn">
                            <button className="open-btn" onClick={() => navigateToTask(task._id)}>
                              View
                            </button>
                            <div className="list-item-small-btns">
                              <i className="bx bxs-trash" onClick={() => handleDeleteTask(task._id)}></i>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }

                <div className="submitted-tasks">
                  <div className="create-project-heading">
                    <h3>Submitted Tasks</h3>
                    <hr className="horizontal-line" />
                  </div>


                  {submittedTasks.length === 0 ?

                    <div className="no-projects">
                      <p>No Sumbissions yet. </p>

                    </div>

                    :

                    <div className="recent-projects">
                      <div className="dash-projects-list">
                        {submittedTasks.map((task) => (
                          <div className="list-item" key={task._id}>
                            <div className="list-item-text">
                              <h4 style={{ margin: "0" }}>{task.name.split(" ").slice(0, 3).join(" ")}</h4>
                              <span>
                                {new Date(task.expiryDate).toLocaleDateString()}{" "}
                                <b style={{ color: "white", fontWeight: "500", marginBottom: "10px" }}></b>
                              </span>
                              <p style={{ marginTop: "5px", fontSize: "12px", color: "green", fontWeight: "700" }}> // {task.importance} task
                              </p>
                              <p style={{ marginTop: "5px" }}>{task.description.split(" ").slice(0, 10).join(" ")} ......</p>
                              <p style={{ marginTop: "5px" }}>
                                <b>Submitted By:</b>{" "}
                                {getUniqueUserNames(task.submittedBy).map((name, index) => (

                                  <span style={{ color: "yellow" }} key={index}>
                                    {name}
                                    {index < getUniqueUserNames(task.submittedBy).length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </p>
                            </div>

                            <div className="list-item-btn">
                              <button className="open-btn" onClick={() => navigateToTask(task._id)}>
                                View
                              </button>
                              <div className="list-item-small-btns">
                                {/* <i className="bx bxs-trash" onClick={()=>handleDeleteTask(task._id)}></i> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={`${bigModal} ${modalIsOpen ? 'Modal--open' : ''}`}
          overlayClassName={`Overlay ${modalIsOpen ? 'Overlay--open' : ''}`}
        >
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>

            <div className="h3">
              <h3>Create Task</h3>
            </div>

            <form onSubmit={handleCreateTask} className="task-form">
              <div className="task-fields">
                <label htmlFor="">Task Name <span className="required">*</span></label>
                <input className='task-name' type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}
                />
              </div>

              <div className="task-fields">
                <label htmlFor="">Deadline <span className="required">*</span></label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                  min={todaysDate}
                  max="2025-6-31"
                />
              </div>

              <div className="task-fields">

                <label>Select Importance <span className="required">*</span></label>
                <select
                  value={newTaskImportance}
                  onChange={(e) => setNewTaskImportance(e.target.value)}
                >
                  <option value=''>Select</option>
                  <option value="Important" >Important</option>
                  <option value="Less Important">Less Important</option>
                  <option value="Not Important">Not Important</option>
                </select>

              </div>


              <div className="task-fields">
                <label htmlFor="">Task Details <span className="required">*</span></label>
                <textarea rows={5} value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} ></textarea>

              </div>


              <button type='submit'>Create Task</button>

            </form>

          </div>
        </Modal>


      </div>


      <Toaster
        position="top-right"
        reverseOrder={true}
      />

    </>
  );
};

export default Project;






// const [bigModal, setBigModal] = useState('Modal');


// const closeHome = () => {
//   if (homeClose === '') {
//     setHomeCLose('close-home');
//   } else setHomeCLose('');
// };
// const closeSidebar = () => {
//   if (closeSide === '') setCloseSide('close');
//   else setCloseSide('');

//   if (bigModal === 'Modal')
//     setBigModal('Modal-big-screen')
//   else setBigModal('Modal');
//   closeHome();
// };

