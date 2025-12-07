import React, { useRef, useState } from 'react'
import { CODE_SNIPPETS } from '../Task/Constants';
import { executeCode } from "../Task/api";
import MonacoEditor from '@monaco-editor/react';
import toast, { Toaster } from 'react-hot-toast';
import './Dash.css'

const DashboardCompiler = (props) => {


    //code editor
    const [language, setLanguage] = useState('javascript');
    const [closedOutput, setClosedOutput] = useState('dashboard-compiler-output');
    const [code, setCode] = useState(CODE_SNIPPETS[language]);

    const editorRef = useRef();




    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };


    const handleCodeChange = (newValue) => {
        setCode(newValue);

    };



    const handleOnSelect = (e) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        setCode(CODE_SNIPPETS[selectedLanguage] || '');


    };

    const outputAreaRef = useRef(null);


    const handleRunClick = () => {
        outputAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
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




    return (
        <>

            <section className="home-section bg-black">
                <div className="home-content">
                    <i style={{ color: "white" }} className='bx bx-menu bx-sm' onClick={props.handleClick}></i>
                    <span style={{ color: "white" }} className="text"></span>
                </div>


                <div className="dash-all-content">



                    <div className="create-project-heading">
                        <h3>Compiler</h3>
                        <hr className='horizontal-line' />
                    </div>


                    <div className="all-editor-content">

                        <section className="code-editor">
                            <div className="editor-controls">

                                <div className="left-editor-controls">
                                    <select className='editor-language-selector' value={language} onChange={handleOnSelect}>
                                        <option value="javascript">JavaScript</option>
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


                        <div>


                            <div className="dashboard-compiler-output">
                                <div>
                                    <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                                        Output
                                    </h3>

                                    <div
                                        style={{
                                            height: "75.5vh",
                                            width: "100%",
                                            padding: "10px",
                                            margin: "1px",
                                            background: "white",
                                            color: isError ? "red" : "black",
                                            border: `1px solid ${isError ? "red" : "#cfc6c6"}`,
                                            borderRadius: "1px",
                                            overflowY: "scroll",
                                            whiteSpace: "pre-wrap",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        {output
                                            ? output.map((line, i) => <div key={i}>{line}</div>)
                                            : 'Click "Run Code" to see the output here'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>





                </div>
            </section>



            <Toaster position="top-right" />


        </>
    )
}

export default DashboardCompiler