
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import MonacoEditor from '@monaco-editor/react';
import Avatar from 'react-avatar';
import authService from '../../services/authService'
import { CODE_SNIPPETS } from './Constants';
import { executeCode } from "./api";
import Canvas from './Canvas';



const socket = io('http://localhost:5000');

const Task = () => {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isMainUser, setIsMainUser] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Modal style
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // CodeEditor Component
  const [code, setCode] = useState('');


  // Current User
  const [currentuser, setCurrentUser] = useState("");



  //code editor
  const [language, setLanguage] = useState('javascript');
  const [isModified, setIsModified] = useState({});
  const editorRef = useRef();



  const [typer, setTyper] = useState();


  const userId = localStorage.getItem('userId');









  useEffect(() => {
    const fetchTask = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const viewOnlyParam = urlParams.get('viewOnly') === 'true';
      setViewOnly(viewOnlyParam);
      const fetchedTask = await taskService.getTask(taskId);
      setTask(fetchedTask.task);
      setIsMainUser(fetchedTask.isMainUser);
      const inviteURL = `${window.location.origin}/project/${projectId}/task/${taskId}?viewOnly=${viewOnlyParam}`;
      setInviteLink(`${window.location.origin}/login?redirect=${encodeURIComponent(inviteURL)}`);
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

    fetchTask();
    fetchUser();


    const userId = localStorage.getItem('userId');
    socket.emit('joinTask', { taskId, userId });


    const handleMessageReceive = (msg) => {
      const myMess = msg.message;

      console.log("message from handleMessageRecieve: ", msg);


      if (msg.userId !== userId) {
        setMessages((prevMessages) => [...prevMessages, { ...myMess, type: 'incoming' }]);
        scrollToBottom();
      }
    };


    socket.on('codeChange', (e) => {
      setCode(e.code);
      console.log(e.firstname);
      setTyper(e.firstname);
    });

    socket.on('updateConnectedUsers', (users) => {
      setConnectedUsers(users);
    });

    socket.on('userJoined', (user) => {
      // toast.success(`${user.name} joined`);
      console.log(user.name, "joined the task...");
    });





    socket.on('recieve-message', handleMessageReceive);



    return () => {
      socket.emit('leaveTask', { taskId, userId });
      socket.off('codeChange');
      socket.off('userJoined');
      socket.off('recieve-message', handleMessageReceive);
    };
  }, [taskId, projectId]);





  useEffect(() => {
    const generateInviteLink = () => {
      const inviteURL = `${window.location.origin}/project/${projectId}/task/${taskId}?viewOnly=${viewOnly}`;
      setInviteLink(`${window.location.origin}/login?redirect=${encodeURIComponent(inviteURL)}`);
    };

    generateInviteLink();
  }, [viewOnly, taskId, projectId]);






  // -----------------CODE EDITOR------------------



  useEffect(() => {
    const fetchCode = async () => {
      try {
        const fetchedCode = await taskService.getCode(taskId, language);
        setCode(fetchedCode.code || CODE_SNIPPETS[language] || '//Write your code here');
      } catch (error) {
        console.error('Error fetching task code', error);
      }
    };

    fetchCode();
  }, [taskId, language]);





  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleOnSelect = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    if (!isModified[selectedLanguage]) {
      // Fetch the code for the selected language
      taskService.getCode(taskId, selectedLanguage)
        .then(fetchedCode => {
          setCode(fetchedCode.code || CODE_SNIPPETS[selectedLanguage] || '');
        })
        .catch(error => {
          console.error('Error fetching code for selected language', error);
          setCode(CODE_SNIPPETS[selectedLanguage] || '');
        });
    }
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    setIsModified((prevState) => ({
      ...prevState,
      [language]: true,
    }));
    const userId = localStorage.getItem('userId');
    socket.emit('codeChange', { taskId, code: newValue, userId });
  };



  const saveCode = async () => {
    try {
      // Save the code to the backend database
      await taskService.handleSave(taskId, code, language);
      toast.success('Code saved successfully');

      // Update the modified state for the current language
      setIsModified((prevState) => ({
        ...prevState,
        [language]: true,
      }));
    } catch (error) {
      console.error('Error saving code', error);
      toast.error('Error saving code');
    }
  };





  // Output section 
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      console.log(result);
      handleRunClick();
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(error);
      toast.error(`${error.message}, check internet ` || "Unable to run code! Try again after sometime")
    } finally {
      setIsLoading(false);
    }
  };






  // Chat Section
  const messageAreaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value);
    }
  };


  const sendMessage = (message) => {
    const msg = {
      user: currentuser.firstname,
      message: message.trim()
    };
    const userId = localStorage.getItem('userId');
    setMessages((prevMessages) => [...prevMessages, { ...msg, type: 'outgoing' }]);

    setMessage('');
    scrollToBottom();
    socket.emit('chatMessage', { taskId, message: msg, userId });
  };

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }








  const handleShareClick = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied successfully!");
  };

  const handleSubmitTask = async () => {
    const suc = await taskService.submitTask(taskId);
    if (suc) {
      alert("Task submitted successfully");
    }
    if (isMainUser) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/thank-you');
    }
  };

  const handleLeaveTask = () => {
    if (isMainUser) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/thank-you');
    }
  };

  const handleViewOnlyChange = (e) => {
    setViewOnly(e.target.checked);
  };

  const uniqueUsers = connectedUsers.reduce((accumulator, current) => {
    if (!accumulator.find(user => user.userId === current.userId)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);




  const outputAreaRef = useRef(null);

  const handleRunClick = () => {
    outputAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  if (!task) return <div>Loading...</div>;

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  }



  ///Calculate the days remaining
  const calculateDaysRemaining = (expiryDate) => {
    const currentDate = new Date();
    const deadlineDate = new Date(expiryDate);
    const timeDifference = deadlineDate - currentDate;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const daysRemaining = calculateDaysRemaining(task.expiryDate);











  console.log("Typer: ", typer);






  return (
    <>
      <div className="dashboard-component">
        <div className={`dashboard-sidebar`}>
          <div className="app-logo">
            <h2>DevHub</h2>
          </div>
          <aside className='task-sidebar-content'>
            <div className="dash-project-info">
              <div className="project-info">
                <div className='task-connected-users'>
                  <h3>Connected Users</h3>
                  <div className='task-connected-users-list'>
                    {uniqueUsers.map((user) => (
                      <div className='task-connected-user-box' key={user.userId}>
                        <Avatar name={user.name} size='40' round="3px" color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} />
                        {typer === user.name ? <span>{user.name} typing</span> : <span>{user.name}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <h4>{task.name}</h4>
                <p className="project-info-deadline">
                  {new Date(task.expiryDate).toLocaleDateString()}
                  {daysRemaining <= -1 ? <span style={{ color: "red", fontSize: "12px", lineHeight: "16px" }} > <b> - Expired {Math.abs(daysRemaining)} days before </b></span> : <span style={{ color: "yellow", fontSize: "12px" }} > - {daysRemaining} days remaining</span>}
                </p>
                <p className="project-info-importance">{task.importance}</p>
                <div className="project-info-description">
                  <h5>Description : </h5>
                  <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>
                </div>
              </div>
            </div>
            <div className="logout task-logout-section">
              {isMainUser ? <button className='back-btn' onClick={handleBack}>Back</button> : ""}
              <button className='leave-task-btn' onClick={handleLeaveTask}>Leave Task</button>
              {isMainUser ? "" : <button className='submit-task-btn' onClick={handleSubmitTask}>Submit Task</button>}
            </div>
          </aside>
        </div>
        <div className={`dash-home-section`}>
          <div className="dashboard-navbar task-dashboard-navbar">


            {/* <div className="close-side-icon">
              <span className='menu-iocn'><i onClick={closeSidebar} className='bx bx-menu bx-sm'></i></span>
            </div> */}

            <div>
              |
            </div>




            <div className="task-share-btn">
              {isMainUser ? <button onClick={handleShareClick} className='task-invite-user-btn'>Invite User <i className='bx bxs-share bx-flip-horizontal' style={{ color: '#fff' }}></i></button> : ""}
            </div>


          </div>
          <div>
            <main className='task-page-content'>
              <div className="code-editor-and-chat-section">
                <section className="code-editor">
                  <div className="editor-controls">

                    <div className="left-editor-controls">
                      <select className='editor-language-selector' value={language} onChange={handleOnSelect}>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="php">PHP</option>
                        <option value="cpp">C++</option>
                        <option value="rust">Rust</option>
                        <option value="dart">Dart</option>
                        <option value="go">Go</option>
                        <option value="ruby">Ruby</option>
                      </select>
                    </div>

                    <div className="right-editor-controls">
                      <div className="save-button">
                        <button className='code-save-btn' onClick={saveCode}>Save</button>
                      </div>


                      <button
                        style={{
                          border: "1px solid green",
                          color: "green",
                          padding: "8px 16px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          opacity: isLoading ? 0.6 : 1,
                          pointerEvents: isLoading ? "none" : "auto"
                        }}
                        onClick={runCode}
                      >
                        {isLoading ? "Running..." : "Run Code"}
                      </button>
                    </div>
                  </div>
                  <div className="monaco-editor">
                    <MonacoEditor
                      height="79vh"
                      language={language}
                      theme="dark"
                      value={code}
                      options={{
                        readOnly: viewOnly,
                        minimap: {
                          enabled: false,
                        },
                        lineNumbers: "on",
                        automaticLayout: true // Ensures the editor adjusts its layout automatically
                      }}
                      onMount={onMount}

                      onChange={handleCodeChange}
                    />
                  </div>

                </section>



                <section className="task-chat-section">
                  <section className="chat__section">
                    <div className="brand">
                      <h1>Chat With Team</h1>
                    </div>
                    <div className="message__area" ref={messageAreaRef}>
                      {messages.map((msg, index) => (
                        <div key={index} className={`${msg.type} message`}>
                          <h4>{msg.user}</h4>
                          <p>{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div ref={outputAreaRef}>
                      <textarea
                        id="textarea"
                        cols="30"
                        rows="1"
                        placeholder="Write a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                  </section>
                </section>
              </div>


              <div className="output-box" id='output-box' >


                <div className="output-window">
                  <div className="output-area" >
                    <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Output
                    </h3>

                    <div
                      style={{
                        height: "75vh",
                        padding: "10px",
                        margin: "1px",
                        background: "white",
                        color: isError ? "red" : "black",
                        border: `1px solid ${isError ? "red" : "#cfc6c6"}`,
                        borderRadius: "1px",
                        overflowY: "scroll",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      {output
                        ? output.map((line, i) => <div key={i}>{line}</div>)
                        : 'Click "Run Code" to see the output here'}
                    </div>
                  </div>
                </div>
              </div>




              <section className="whiteboard-section">
                <div className="whiteboard-heading">
                  <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Whiteboard</h3>
                </div>

                <Canvas taskId={taskId} userId={userId} />

              </section>


            </main>





            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleCloseModal}
              className={`ShareModal ${modalIsOpen ? 'ShareModal--open' : ''}`}
              overlayClassName={`ShareOverlay ${modalIsOpen ? 'ShareOverlay--open' : ''}`}
            >
              <div className="modal-content">
                <button className="modal-close-button" onClick={handleCloseModal}>
                  &times;
                </button>
                <div className="share-invite-link-box">

                  <div className='share-invite-view-only'>
                    <label>
                      View Only
                      <input
                        type="checkbox"
                        checked={viewOnly}
                        onChange={handleViewOnlyChange}
                      />
                    </label>
                  </div>


                  <div className="share-invite-copy-link">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="invite-link-input"
                    />
                    <button onClick={handleCopyInviteLink} className="copy-invite-link">
                      Copy Link
                    </button>
                  </div>

                </div>
              </div>
            </Modal>
            <Toaster position="top-right" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;




















