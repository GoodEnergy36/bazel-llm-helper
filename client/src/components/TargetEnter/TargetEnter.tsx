import './TargetEnter.css';

interface TargetEnterProps {
    isTargetEnterActive: boolean;
    analyzeBazelDeps: () => Promise<void>;
    workspace: string;
    sourceFile: string;
    setWorkspace: React.Dispatch<React.SetStateAction<string>>;
    setSourceFile: React.Dispatch<React.SetStateAction<string>>;
    count: number;
    errorList: Array<string>;
}

const TargetEnter: React.FC<TargetEnterProps> = ({isTargetEnterActive, analyzeBazelDeps, workspace, sourceFile, setWorkspace, setSourceFile, count, errorList}) => {

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
        <div className='loader'>{Array(count).fill('.')}</div>
        {errorList && (
          errorList.map((element, index) => (
            <div key={index}>{element}</div>
          ))
        )}
    </div>
  )
};

export default TargetEnter;