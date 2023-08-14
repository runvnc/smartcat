#!/usr/bin/env node

import fs from 'fs'
import https from 'https'
import askChat from './askchat.js'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
}

let inputText = "";

for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    
    if (fs.existsSync(arg)) {
        inputText += `----- FILE: ${arg} -----\n`;
        inputText += fs.readFileSync(arg, 'utf8');
        inputText += "\n-----------------------\n";
    } else {
        inputText += `${arg}\n`;
    }
}

const note = `

IMPORTANT: This will be used in scripts, raw file output only, no header, separators, or filename! 
`
askChat([{role:'user', content: inputText + note}])

