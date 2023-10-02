import { OpenAI } from "openai-streams/node"

function decode(str) {
    const replacedEscapes = str
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\\"/g, '\"')
      .replace(/\\\'/g, '\'')
      .replace(/\"stdout\"\: \"/g, '')
    return replacedEscapes;
}

async function askChat(messages, functions=null, model='gpt-3.5-turbo-16k', allowed='auto') {
  const cfg = { model, messages, function_call: allowed, 
                temperature: 0.0, n: 1,
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
            lastout += deltas[key][key2]
          
            if (decode(lastout).indexOf("\n") >= 0) {
              process.stderr.write(decode(lastout))
              lastout = ''
            }
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
