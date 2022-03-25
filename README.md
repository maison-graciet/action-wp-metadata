

# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

## `folder`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

## `json`

json with comment wp version updated.

## `contentUpdated`

comment wp version updated.

## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat'