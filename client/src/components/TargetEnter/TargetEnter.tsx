import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import './TargetEnter.css';

interface TargetEnterProps {
    isTargetEnterActive: boolean;
    analyzeBazelDeps: () => Promise<void>;
    workspace: string;
    sourceFile: string;
    setWorkspace: React.Dispatch<React.SetStateAction<string>>;
    setSourceFile: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}

const TargetEnter: React.FC<TargetEnterProps> = ({isTargetEnterActive, analyzeBazelDeps, workspace, sourceFile, setWorkspace, setSourceFile, isLoading}) => {

  if (!isTargetEnterActive) return null;
  
  return (
    <div className='TargetEnterBody'>
        <input
            type="text"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="api-input"
            placeholder="Enter OpenAI API Key"
        />
        <input
            type="text"
            value={sourceFile}
            onChange={(e) => setSourceFile(e.target.value)}
            className="api-input"
            placeholder="Enter OpenAI API Key"
        />
        <button
          onClick={analyzeBazelDeps}
        >
            Analyse target
        </button>
        {isLoading &&
            <div>
                Loading
            </div>
        }
    </div>
  )
};

export default TargetEnter;