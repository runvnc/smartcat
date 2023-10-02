Ask ChatGPT using some files as part of the instructions.

Will cat (output) any files listed in order with filename and separator; any double quoted command arguments are inserted as instructions.

## Breaking change

Then this is sent to OpenAI as a completion and the response is sent to the file(s) specified by ChatGPT.

# Install

```shell
npm i -g aicat

export OPENAPI_AI_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
```

# Usage

```shell
# should create file2.mustache

aicat file1.mustache file2.html "extract template fields from file1 and insert into appropriate locations in file2"
```

GPT-4

```shell

# should create mlb.txt or similar

aicat -4 "list of MLB teams sorted by city name"
```


