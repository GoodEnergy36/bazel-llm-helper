# Bazel Scope


## Quick Introduction

This program aims to help developers understand bazel targets with the help of LLMs. 

This is achieved with a locally hosted web-app where users can define the path to a bazel workspace, and a target withing that workspace.
A script is executed that recursively identifyies libraries and source code files that said bazel target depends on,
creates a json object that contains those libraries and the contents of the dependent source files, sends it to an LLM (OpenAI) which analyses the json object,
waits for a repsonse, prints the markdown response to the user where the user can continue the conversation with the LLM via a text box at the bottom.

### Prerequisites

Ensure you have `npm` installed. [nodejs installation guide](https://nodejs.org/en/download/)

Ensure you have `python` installed. [python installation](https://www.python.org/downloads/)

### Instructions

Once cloned onto your local machine, `cd` into this directory and run `npm install`.

When the installation process is complete, execute `npm run dev`.

If all goes well, bazel scope should be running on [http://localhost:5173/](http://localhost:5173/).

### Notes

This will require you have your own OpenAI API key with credits available. 

This program makes calls to Open AI's `gpt-4.5-preview` model. It is really powerful but it's slow as fuck. If you'd like to switch some performace for speed, in `server/src/routes/api.chat.ts`, `gpt-4.5-preview` can be switched for any of the models found [here](https://platform.openai.com/docs/models#gpt-4o).

## Bazel Scope: Technical Documentation

Bazel Scope is a full-stack web application that helps developers analyze and understand Bazel dependency trees for their projects. The application provides an intuitive interface for users to specify Bazel targets, analyzes the dependencies using a custom Python script, and leverages an AI-powered assistant (OpenAI's ChatGPT) to generate comprehensive documentation about the codebase structure, components, and dependencies. The system consists of a React frontend and an Express.js backend that executes Python scripts for Bazel dependency analysis.

## Table of Contents

1. [Architecture](#architecture)
2. [Key Components](#key-components)
3. [Data Flow](#data-flow)
4. [User Interface](#user-interface)
5. [Authentication](#authentication)
6. [API Integration](#api-integration)
7. [Local Storage](#local-storage)
8. [Error Handling](#error-handling)
9. [State Management](#state-management)
10. [Technical Dependencies](#technical-dependencies)

## Architecture

Bazel Scope follows a full-stack architecture with a React frontend and an Express.js backend. The backend executes a custom Python script for Bazel dependency analysis and proxies requests to the OpenAI API.

### Frontend Architecture
```
client/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── App/              # Main application container
│   │   ├── Modal/            # API key configuration modal
│   │   └── TargetEnter/      # Bazel target input component
│   └── utils/                # Utility functions and services
│       ├── chatgpt.ts        # OpenAI API communication
│       ├── constant.ts       # Application constants
│       ├── pythonExecutor.ts # Backend Python script executor
│       └── storage.ts        # Local storage utilities
```

### Backend Architecture
```
src/
├── index.ts                   # Express server entry point
├── routes/                    # API route handlers
│   ├── api.chat.ts            # OpenAI API proxy
│   └── api.execute-python.ts  # Python script execution endpoint
└── scripts/                   # Backend scripts
    └── BazelSourceAnalyzer.py # Bazel dependency analysis script
```

## Key Components

### Frontend Components

#### App Component

The main container component that orchestrates the application flow. It maintains the application state, handles user interactions, and coordinates between the target input, dependency analysis, and AI-generated documentation.

**Key Responsibilities:**
- Manages application state (workspace paths, source files, chat history)
- Coordinates Bazel dependency analysis
- Handles communication with the ChatGPT API
- Renders the user interface based on application state
- Manages user input and responses

#### Modal Component

A reusable modal dialog component used for configuration settings, specifically for setting the OpenAI API key.

**Key Responsibilities:**
- Provides a secure input for the OpenAI API key
- Saves configuration to local storage
- Handles modal visibility state

#### TargetEnter Component

Handles user input for Bazel workspace and target specifications.

**Key Responsibilities:**
- Captures workspace path and source file inputs
- Triggers Bazel dependency analysis
- Displays loading indicators and error messages
- Validates user input

### Backend Components

#### Express Server (index.ts)

The main entry point for the backend server that sets up middleware and routes.

**Key Responsibilities:**
- Configures Express middleware (CORS, JSON parsing)
- Sets up API routes
- Starts the HTTP server

#### OpenAI API Proxy (api.chat.ts)

Handles communication with the OpenAI API for generating documentation.

**Key Responsibilities:**
- Authenticates requests using user-provided API keys
- Forwards requests to OpenAI's ChatGPT API
- Processes and returns AI-generated responses
- Handles error cases and provides appropriate feedback

#### Python Script Executor (api.execute-python.ts)

Executes the Bazel dependency analysis Python script.

**Key Responsibilities:**
- Receives workspace and source file parameters
- Spawns a child process to execute the Python script
- Captures and returns the script's output
- Handles execution errors

#### Bazel Source Analyzer (BazelSourceAnalyzer.py)

A Python script that analyzes Bazel targets to extract dependency information and source code.

**Key Responsibilities:**
- Executes Bazel query commands to identify dependencies
- Recursively analyzes dependent libraries
- Extracts and includes source code content
- Builds a comprehensive dependency tree with full source code
- Returns the analysis as a structured JSON object

## Data Flow

1. **Configuration Phase**
   - User enters their OpenAI API key via the Modal component
   - Key is stored securely in local storage

2. **Target Specification Phase**
   - User specifies the Bazel workspace path and source file
   - Application validates inputs

3. **Analysis Phase**
   - Frontend sends workspace path and source file to the backend
   - Backend executes the BazelSourceAnalyzer.py script as a child process
   - The Python script performs several key operations:
     - Executes `bazel cquery` commands to identify direct dependencies
     - Parses the query results to identify source files and library dependencies
     - Reads the content of source files and includes it in the results
     - Recursively analyzes dependent libraries to build a complete dependency tree
     - Returns a structured JSON representation of the dependency tree
   - Backend captures the script output and returns it to the frontend

  (More information anout this script can be found at)

4. **Documentation Generation Phase**
   - Frontend adds the Bazel dependency data to the system message for ChatGPT
   - The OpenAI API key is sent with the request to the backend
   - Backend proxies the request to OpenAI's ChatGPT API
   - AI generates comprehensive documentation based on the dependency data
   - Documentation is returned to the frontend and displayed to the user

5. **Interaction Phase**
   - User can ask follow-up questions or request additional information
   - Queries are sent to the backend with previous conversation history
   - Backend forwards queries to ChatGPT with the complete context
   - Responses are displayed in a conversational interface

## User Interface

The application provides a clean, intuitive interface with three main states:

1. **Initial State**
   - Toolbar with application title and configuration options
   - Target input form for workspace and source file specification

2. **Analysis State**
   - Loading indicator showing progress
   - Error messages if analysis fails

3. **Documentation State**
   - Conversational interface showing the generated documentation
   - Input field for follow-up questions
   - Option to start a new analysis

## Authentication

The application does not implement user authentication directly. Instead, it requires users to provide their own OpenAI API key, which is:
- Stored in the browser's local storage
- Sent with each request to the ChatGPT API
- Never transmitted to any other services

## API Integration

### Backend Python Execution API

The application communicates with a backend service to execute Python scripts for Bazel dependency analysis:

- **Endpoint**: `/api/execute-python`
- **Method**: POST
- **Parameters**:
  - `workspace`: Path to the Bazel workspace
  - `sourceFile`: Target Bazel source file
- **Response**: JSON object containing the analysis results

### OpenAI ChatGPT API

The application communicates with OpenAI's ChatGPT API to generate documentation:

- **Endpoint**: `/api/chat` (proxied to OpenAI)
- **Method**: POST
- **Headers**:
  - `Content-Type`: application/json
  - `x-api-key`: User's OpenAI API key
- **Parameters**:
  - `messages`: Array of conversation messages, including:
    - System message containing Bazel dependency data
    - User message containing the prompt
    - Previous conversation history
- **Response**: AI-generated documentation or conversation responses

## Local Storage

The application uses browser local storage to persist:
- OpenAI API key (as part of the application configuration)

The storage utility provides two main functions:
- `getConfig()`: Retrieves stored configuration
- `setConfig()`: Updates and persists configuration

## Error Handling

The application implements several error handling mechanisms:

1. **Input Validation**
   - Checks for empty workspace or source file strings
   - Verifies OpenAI API key is configured

2. **API Error Handling**
   - Catches and logs errors from the Python execution API
   - Handles ChatGPT API failures gracefully

3. **User Feedback**
   - Displays error messages in the TargetEnter component
   - Provides visual indicators for loading states

4. **Request Cancellation**
   - Implements AbortController to cancel ongoing API requests
   - Allows users to start new analyses without waiting for previous requests to complete

## State Management

State management is handled using React's useState and useEffect hooks:

- **Application State**:
  - `isModalActive`: Controls the visibility of the API key configuration modal
  - `isLoading`: Tracks loading state during API requests
  - `workspace`, `sourceFile`: Stores Bazel target information
  - `bazelData`: Contains the analyzed dependency data
  - `chatHistory`: Maintains the conversation with the AI assistant
  - `userResponse`: Captures user input for follow-up questions
  - `errorList`: Stores validation and runtime errors

- **Modal State**:
  - `apiKey`: Stores the OpenAI API key during configuration

- **TargetEnter State**:
  - `count`: Controls the loading indicator animation

## Technical Dependencies

### Frontend Dependencies
- **React**: Frontend UI library
- **ReactMarkdown**: Markdown rendering for AI responses
- **Fetch API**: Network requests to backend services
- **Local Storage API**: Configuration persistence
- **AbortController API**: Request cancellation

### Backend Dependencies
- **Express**: Web server framework
- **CORS**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management
- **OpenAI SDK**: ChatGPT API client
- **child_process**: Node.js module for spawning external processes
- **util.promisify**: Converting callback-based functions to Promise-based

### External Dependencies
- **Bazel**: Build tool for dependency analysis
- **Python 3**: Runtime for the Bazel analysis script
