// src/services/taskServices.js
import axios from 'axios';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;


const API_URL = `${CLIENT_URL}/api/tasks`;

const getTasks = async (projectId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};




const createTask = async (projectId, name, expiryDate, importance, description) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, { projectId, name, expiryDate, importance, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



const deleteTask = async (taskId, projectId) => {
  const token = localStorage.getItem('token');
  const taskData = { taskId };
  const response = await axios.delete(`${API_URL}/${projectId}`, {
    headers:{Authorization: `Bearer ${token}`},
    data: taskData
  });

  console.log(response);

  return response.data;
}




const getTask = async (taskId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/task/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};







//Submit task end point
const submitTask = async (taskId) => {
  const token = localStorage.getItem('token');
  console.log(token);
  const response = await axios.put(`${API_URL}/${taskId}/submit`, { taskId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getSubmittedTasks = async (projectId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/submitted/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



const getCode = async (taskId, language) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/get-code/${taskId}/${language}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Note this returns the task directly
};



const handleSave = async (taskId, code, language) => {
  const token = localStorage.getItem('token');
  await axios.put(`${API_URL}/task/${taskId}/save`, { code, language }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


const myTaskFunctions = {
  getTasks,
  createTask,
  getTask,
  getSubmittedTasks,
  submitTask,
  handleSave,
  getCode,
  deleteTask,
};

export default myTaskFunctions;

