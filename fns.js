import fs from 'fs/promises'

export async function fileOut({filename, text}) {
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
