import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MonacoEditor from '@monaco-editor/react';
import taskService from '../../services/taskService';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;


const socket = io(CLIENT_URL);

const CodeEditor = ({ taskId, viewOnly }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const task = await taskService.getCode(taskId);
        console.log("Fetching code from getCode()", task);
        setCode(task.code || '');
      } catch (error) {
        console.error('Error fetching task code', error);
      }
    };

    fetchCode();

    const userId = localStorage.getItem('userId');
    socket.emit('joinTask', { taskId, userId });

    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.emit('leaveTask', { taskId, userId });
      socket.off('codeChange');
    };
  }, [taskId]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    const userId = localStorage.getItem('userId');
    socket.emit('codeChange', { taskId, code: newValue, userId });
  };

  const saveCode = async () => {
    try {
      await taskService.handleSave(taskId, code);
      alert('Code saved successfully');
    } catch (error) {
      console.error('Error saving code', error);
      alert('Error saving code');
    }
  };

  return (
    <>
      <div className="editor-controls">
        <select>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <div className="save-button">
        <button onClick={saveCode}>Save</button>
      </div>

      <MonacoEditor
        height="70vh"
        width="150vh"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{
          readOnly: viewOnly,
        }}
        onChange={handleCodeChange}
      />

      <div className="output-window">
        <button>Run</button>
        {/* Add output display logic */}
      </div>
    </>
  );
};

export default CodeEditor;



