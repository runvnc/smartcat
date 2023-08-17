import {yieldStream} from 'yield-stream'
import { OpenAI } from "openai-streams/node"

function getDeltas(ev) {
  let deltas = []
  for (let ch of ev.choices) {
    deltas.push(ch.delta)
  }
  if (deltas.length > 1) {
    throw new Error('Received multiple deltas in an event')
  }
  return deltas[0]
}

async function askChat(messages, model='gpt-3.5-turbo-16k') {
  let cfg = { model, messages,
              temperature: 0.0, n: 1,
              presence_penalty: 0.6 }   

  const stream = await OpenAI("chat", cfg, {mode: 'raw'} )
  let decoder = new TextDecoder()

  try {
    for await (const chunk_ of stream) {
      let chunk = JSON.parse(decoder.decode(chunk_))
      if (chunk.error) {
        throw new Error(JSON.stringify(chunk))
        return 
      }
      chunk = getDeltas(chunk)
      if (chunk?.content) process.stdout.write(chunk.content)
    }
  } catch (e) {
    console.error(e)
  }
}

export default askChat
