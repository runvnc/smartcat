import { OpenAI } from "openai-streams/node"

async function askChat(messages, functions=null, model='gpt-3.5-turbo-16k') {
  const cfg = { model, messages, 
              temperature: 0.0, n: 1,
              presence_penalty: 0.6 }   
  if (functions) cfg.functions = functions
  const stream = await OpenAI("chat", cfg, {mode: 'raw'} )
  let content = '', function_call = {}
  
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
            function_call[key2] = (function_call[key2] || '') + deltas[key][key2]
            if (deltas[key][key2]) process.stdout.write(deltas[key][key2])
          }
        } else if (key === 'content') {
          content += deltas.content
          if (deltas.content) process.stdout.write(deltas.content)
        }
      }
    }
    
    console.log()
    return {content, function_call}
  } catch (e) {
    console.error(e)
    throw e
  }
}

export default askChat
