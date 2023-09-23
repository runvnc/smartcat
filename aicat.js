#!/usr/bin/env node

import fs from 'fs'
import https from 'https'
import askChat from './askchat.js'
import {textOut, getDefinitions} from './fns.js'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
}

console.error("Note: The streaming output is on stderr and has some minor issues,")
console.error("but when it finishes streaming it will write the correct text to stdout.\n\n")

let inputText = "";
let model = 'gpt-3.5-turbo-16k'

for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg == '-4') {
      model = 'gpt-4'
      continue
    }

    if (fs.existsSync(arg)) {
        inputText += `----- FILE: ${arg} -----\n`;
        inputText += fs.readFileSync(arg, 'utf8');
        inputText += "\n-----------------------\n";
    } else {
        inputText += `${arg}\n`;
    }
}


const sysinfo = `

You are an advaned AI software engineer, taking the place of the Linux cat command.
You MUST Use the stdOut() function with the {out} parameter.
Output ONLY what is requested, with no extra example files.
DO NOT include a filename header since there is only one file being output.
`

const note = `output raw text only: `


let {function_call} = await askChat([{role:'system', content: sysinfo, 
                               role:'user', content: inputText}], getDefinitions(), model)
try {
  let cleaned = function_call.arguments.replace(/[\x00-\x1F]+/g, '');
  console.error()
  
  textOut(JSON.parse(cleaned))
} catch (e) {
  
  console.error(e)
  console.log(function_call.arguments)

}

