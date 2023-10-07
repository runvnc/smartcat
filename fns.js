import fs from 'fs/promises'
import path from 'path'

export async function fileOut({filename, text}) {
  const dir = path.dirname(filename)
  const backupDir = path.join(dir, '.backup')
  const baseName = path.basename(filename)
  let index = 0

  try {
    await fs.access(backupDir)
  } catch (err) {
    await fs.mkdir(backupDir)
  }

  while (true) {
    try {
      await fs.access(path.join(backupDir, `${baseName}.${index}`))
      index++
    } catch (err) {
      break
    }
  }

  try {
    const backupFile = path.join(backupDir, `${baseName}.${index}`)
    await fs.rename(filename, backupFile)
    console.error(`Backup file created: ${backupFile}`)
  } catch (err) {
    // File doesn't exist, do nothing
  }

  await fs.writeFile(filename, text, 'utf8')
}

export function getDefinitions() {
    return [
      {
            "name": "done",
            "description": "Indicates all files have been output.",
            "parameters": {
              "type": "object",
              "properties": {}
            }
      },
      {
            "name": "fileOut",
            "description": "Outputs the text to the specified file.",
            "parameters": {
                "type": "object",
              "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The relative filename.",
                    },
                    "text": {
                        "type": "string",
                        "description": "The file contents.",
                    },
                },
                "required": ["filename", "text"],
            },
        }
    ];
}
