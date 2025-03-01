# Bazel Scope

This program aims to help developers understand bazel targets with the help of LLMs. 

This is achieved with a locally hosted web-app where users can define the path to a bazel workspace, and a target withing that workspace.
A script is executed that recursively identifyies libraries and source code files that said bazel target depends on,
creates a json object that contains those libraries and the contents of the dependent source files, sends it to an LLM (OpenAI) which analyses the json object,
waits for a repsonse, prints the markdown response to the user where the user can continue the conversation with the LLM via a text box at the bottom.

## instructions

Ensure you have `npm` installed. [nodejs installation guide](https://nodejs.org/en/download/)

Once cloned onto your local machine, `cd` into this directory and run `npm install`.

When the installation process is complete, execute `npm run dev`.

If all goes well, bazel scope should be running on [http://localhost:5173/](http://localhost:5173/).

## Notes

This will require you have your own OpenAI API key with credits available. 

This program makes calls to Open AI's `gpt-4.5-preview` model. It is really powerful but it's slow as fuck. If you'd like to switch to some performace for speed, in `server/src/routes/api.chat.ts`, `gpt-4.5-preview` can be switched for any of the models found [here](https://platform.openai.com/docs/models#gpt-4o).
