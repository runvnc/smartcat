import { OpenAI } from "openai-streams/node"

function decodeJSON(jsonStr) {
  try {
    // Try to parse the JSON string
    const parsed = JSON.parse(jsonStr);
    
    // If parsing succeeded, stringify the parsed object 
    // to handle escaped characters and return it as a string
    return JSON.stringify(parsed);
  } catch (err) {
    // If parsing failed, handle escape characters manually and return the string

    // Replacing Unicode escape sequences
    const replacedUnicode = jsonStr.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    });

    // Replacing other escape sequences
    const replacedEscapes = replacedUnicode
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\\"/g, '\"')
      .replace(/\\\'/g, '\'');

    return replacedEscapes;
  }
}

async function askChat(messages, functions=null, model='gpt-3.5-turbo-16k') {
  const cfg = { model, messages, 
                temperature: 0.0, n: 1,
                function_call: { name: 'textOut' },
              presence_penalty: 0.6 }   
  if (functions) cfg.functions = functions
  const stream = await OpenAI("chat", cfg, {mode: 'raw'} )
  let content = '', function_call = {}
  let lastout = ''
  try {
    for await (const chunk_ of stream) {
      const chunk = JSON.parse(new TextDecoder().decode(chunk_))
      if (chunk.error) {
        throw new Error(JSON.stringify(chunk))
      }
      
      const deltas = chunk.choices[0].delta
      for (const key in deltas) {
        if (key === 'function_call') {
          for (const key2 in deltas[key]) {
            if (deltas[key][key2])
              function_call[key2] = (function_call[key2] || '') + deltas[key][key2]
            //process.stderr.write('' + deltas[key][key2] + '')
            process.stderr.write(decodeJSON(deltas[key][key2]))
          }
        } else if (key === 'content') {
          content += deltas.content
          if (deltas.content) process.stderr.write(deltas.content)
        }
      }
    }
    
    return {content, function_call}
  } catch (e) {
    console.error(e)
    throw e
  }
}

export default askChat
