import React, { useState, useEffect, useRef } from 'react';
import './TargetEnter.css';

interface TargetEnterProps {
    isTargetEnterActive: boolean;
    analyzeBazelDeps: () => Promise<void>;
    workspace: string;
    sourceFile: string;
    setWorkspace: React.Dispatch<React.SetStateAction<string>>;
    setSourceFile: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    errorList: Array<string>;
}

const TargetEnter: React.FC<TargetEnterProps> = ({isTargetEnterActive, analyzeBazelDeps, workspace, sourceFile, setWorkspace, setSourceFile, isLoading, errorList}) => {

  const [count, setCount] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isLoading) {
      timerRef.current = setInterval(() => {
        setCount(prev => (prev + 1) % 4);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        setCount(1)
      };
    };
  }, [isLoading]);

  if (!isTargetEnterActive) return null;
  
  return (
    <div className='TargetEnterBody'>
        <input
            type="text"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="api-input-width"
            placeholder="Enter OpenAI API Key"
        />
        <input
            type="text"
            value={sourceFile}
            onChange={(e) => setSourceFile(e.target.value)}
            className="api-input-width"
            placeholder="Enter OpenAI API Key"
        />
        <button
          onClick={analyzeBazelDeps}
        >
            Analyse target
        </button>
        {isLoading &&
            <div className='loader'>{Array(count).fill('.')}</div>
        }
        {errorList && (
          errorList.map((element, index) => (
            <div key={index}>{element}</div>
          ))
        )}
    </div>
  )
};

export default TargetEnter;