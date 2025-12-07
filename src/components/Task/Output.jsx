import { useState } from "react";
import { executeCode } from "./api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "50%", padding: "10px" }}>
      <div style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
        Output
      </div>
      <button
        style={{
          backgroundColor: "transparent",
          border: "1px solid green",
          color: "green",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? "none" : "auto"
        }}
        onClick={runCode}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <div
        style={{
          height: "75vh",
          padding: "10px",
          color: isError ? "red" : "black",
          border: `1px solid ${isError ? "red" : "#333"}`,
          borderRadius: "4px",
          overflowY: "scroll",
          whiteSpace: "pre-wrap"
        }}
      >
        {output
          ? output.map((line, i) => <div key={i}>{line}</div>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
