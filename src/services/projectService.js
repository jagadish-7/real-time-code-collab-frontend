import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

const getProjects = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const createProject = async (projectDetails) => {
  console.log("Name from projectService: ", projectDetails);
  const {newProjectName, newProjectDeadline, newProjectTitle, newProjectImportance, newProjectDescription} = projectDetails;
  console.log("Name : ", newProjectName);
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, { newProjectName, newProjectDeadline, newProjectTitle, newProjectImportance, newProjectDescription }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteProject = async (projectId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


const getOneProject = async (projectId) =>{
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${projectId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}



const projectFunctions = { getProjects, createProject, deleteProject, getOneProject };

export default projectFunctions;
