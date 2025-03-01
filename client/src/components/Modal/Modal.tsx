import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import './Modal.css';
import { storage } from '../../utils/storage';

interface ModalProps {
  isModalActive: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ isModalActive, setIsModalActive }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const config = storage.getConfig();
    setApiKey(config.openaiKey || '');
  }, []);

  const handleSave = () => {
    try {
      storage.setConfig({ openaiKey: apiKey });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('Error saving key');
    }
    setIsModalActive(false)
  };
  
  if (!isModalActive) return null;
  
  return (
    <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
      <div className="modal">
        <div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="key-input-width"
            placeholder="Enter OpenAI API Key"
          />
        </div>
        <div className='modal-button-container'>
          <button onClick={() => setIsModalActive(false)}>Cancel</button>
          <button onClick={handleSave}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;