import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const router = express.Router();
const execAsync = promisify(exec);

router.post('/execute-python', async (req, res) => {
  try {
    const { workspace, sourceFile } = req.body;
    
    // Execute Python script
    const { stdout, stderr } = await execAsync(
      `"python3" "${path.join(process.cwd(), 'src/scripts/BazelSourceAnalyzer.py')}" "${workspace}" "${sourceFile}"`
    );
    
    if (stderr) {
      console.error('Python script error:', stderr);
      return res.status(500).json({ error: stderr });
    }
    return res.json({ result: stdout });
  } catch (error) {
    console.error('Error executing Python script:', error);
    return res.status(500).json({ error: 'Failed to execute Python script' });
  }
});

export default router;