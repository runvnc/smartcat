Ask ChatGPT using some files as part of the instructions.

Will cat (output) any files listed in order with filename and separator; any double quoted command arguments are inserted as instructions.

Then this is sent to OpenAI as a completion and the response is streamed to sdout.

# Install

```shell
npm i -g aicat

export OPENAPI_AI_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
```

# Usage

```shell
aicat file1.mustache file2.html "extract template fields from file1 and insert into appropriate locations in file2" | tee file2.mustache
```

GPT-4

```shell
aicat -4 "list of MLB teams sorted by city name" > mlb.txt
```


