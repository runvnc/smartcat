#!/usr/bin/env node

import fs from 'fs'
import https from 'https'
import askChat from './askchat.js'
import {fileOut, getDefinitions} from './fns.js'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
}

console.error("Note: The streaming output is on stderr and has some minor issues,")
console.error("but when it finishes streaming it will write the correct text to stdout.\
\
")

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

let function_call

const sysinfo = `You are an advanced AI software engineer.
You MUSST call fileOut() to output requested info.
IMPORTANT: Do not output any explanatory text. Just use fileOut one or more times and then call done() when finished.`

let allowed = { name: 'fileOut' }

let msgs = [{role:'system', content: sysinfo, 
             role:'user', content: inputText}] 
do {
  let result = await askChat(msgs, getDefinitions(), model, allowed)
  function_call = result.function_call
  try {
    if (!function_call) break
    if (!function_call.arguments) break
    let cleaned = function_call.arguments; //.replace(/[\x00-\x1F]+/g, '');
    console.error()
    cleaned = JSON.parse(cleaned)
    if (function_call && function_call.name == 'fileOut') {
      await fileOut(cleaned)
      msgs.push({role: 'assistant', function_call, content: null })
      msgs.push({role: 'function', name: 'fileOut', content: 'File saved. Call done() if finished outputting files.'})
      allowed = 'auto'
    } else {
      break
    }
  } catch (e) {
    console.error(e)
  }
} while (function_call && function_call.name != 'done')


