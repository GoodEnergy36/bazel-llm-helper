interface ScriptParams {
  workspace: string;
  sourceFile: string;
}
  
export const executeScript = async (params: ScriptParams): Promise<string> => {
  const response = await fetch('/api/execute-python', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to execute Python script');
  }

  const data = await response.json();
  return data.result;
};