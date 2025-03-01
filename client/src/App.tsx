import { useState, useEffect } from 'react';
import './App.css';
import { executeScript } from './utils/pythonExecutor';
import { sendToChatGPT } from './utils/chatgpt';
import { promptPrefix } from './utils/constant';
import ReactMarkdown from "react-markdown";
import Modal from './components/Modal/Modal';
import TargetEnter from './components/TargetEnter/TargetEnter';


function App() {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [workspace, setWorkspace] = useState("/Users/samtowney/Desktop/code/rules_python");
  const [sourceFile, setSourceFile] = useState("//tools/private/update_deps:args");
  const [bazelData, setBazelData] = useState<string | undefined>(undefined);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [userResponse, setUserResponse] = useState<string>('')
  let currentRequestController: AbortController | null = null;

  useEffect(() => {
    if (bazelData) {
      handleCommand(promptPrefix + bazelData)
    }
  }, [bazelData])

  const analyzeBazelDeps = async () => {
    if (!workspace) {
      console.error('Workspace string is empty');
    }
    if (!sourceFile) {
      console.error('Source File string is empty');
    }
    if (!workspace || !sourceFile) {
      return
    }
    try {
      const result = await executeScript({
        workspace: workspace,
        sourceFile: sourceFile,
      });
      setBazelData(result);
    } catch (error) {
      console.error('Error analyzing Bazel dependencies:', error);
    }
  };

  const handleCommand = async (command: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: command }]);
    setIsLoading(true);

    // Create a new controller for this request
    currentRequestController = new AbortController();
    const { signal } = currentRequestController;

    try {
      const response = await sendToChatGPT(
        {
          messages: [
            {
              role: 'system',
              content: JSON.stringify(bazelData),
            },
            ...chatHistory,
            { role: 'user', content: command },
          ],
        },
        signal
      );
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      // Clear the controller reference and loading state
      if (currentRequestController?.signal === signal) {
        currentRequestController = null;
      }
      setIsLoading(false);
    }
  };

  const cancelCurrentRequest = () => {
    if (currentRequestController) {
      currentRequestController.abort();
      currentRequestController = null;
    }
    setIsLoading(false);
    setChatHistory([])
    setBazelData(undefined)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userResponse.trim()) {
      handleCommand(userResponse);
      setUserResponse('');
    }
  };


  return (
    <div className="App">
      <Modal
        isModalActive={isModalActive}
        setIsModalActive={setIsModalActive}
      />
      <div className="toolbar">
        <h2>
          bazel scope
        </h2>
        <div className='toolbar-buttons'>
          <button
            onClick={()=> setIsModalActive(true)}
          >
            Enter API key
          </button>
          <button
            disabled={chatHistory.length < 1}
            onClick={cancelCurrentRequest}
          >
            Start new Analysis
          </button>
        </div>
      </div>
      {chatHistory.length < 2 &&
        <TargetEnter
          setWorkspace={setWorkspace}
          setSourceFile={setSourceFile}
          workspace={workspace}
          sourceFile={sourceFile}
          analyzeBazelDeps={analyzeBazelDeps}
          isTargetEnterActive={true}
          isLoading={isLoading}
        />
      }

      {chatHistory.length > 1 && (
        <>
          <div className='chat'>
            {chatHistory.map((entry, index) => 
              index > 0 ? (
                <ReactMarkdown key={index}>
                  {entry.content}
                </ReactMarkdown>
              ) : null
            )}
          </div>
          <form 
            className='MessageEnterBody'
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="response-input"
              placeholder="Enter a command..."
            />
          </form>
        </>
      )}

    </div>
  );
}

export default App;