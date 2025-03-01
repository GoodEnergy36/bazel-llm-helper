export const promptPrefix = `You are generating documentation for an affluent Engineering Company
You are a part of a program that generates a bazel dependency tree, is read by an LLM (you), which then creates a base documentation for users that have never seen this code before and want to have detailed insights before they enter the codebase.
In each of the following commands, provide detailed descriptions.
For each file in this dependency chain, please:
Show dependency tree structure
Explain what each component does in isolation
Describe how data/control flows between components
Identify the entry points and end points
Explain any build rules or configurations affecting the system`