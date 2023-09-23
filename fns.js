export function textOut({stdout}) {
  process.stdout.write(stdout + '\n')
}

export function getDefinitions() {
    return [
        {
            "name": "textOut",
            "description": "Outputs ONLY the text requested according to the context and instructions given, with ZERO explanation or external filenames etc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "stdout": {
                        "type": "string",
                        "description": "The output text as a JSON-encoded string.",
                    },
                },
                "required": ["stdout"],
            },
        }
    ];
}
