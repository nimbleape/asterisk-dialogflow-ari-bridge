# Asterisk Dialogflow ARI Bridge

This application creates a bare bones ARI Bridge. It literally takes calls into an extension and sends their audio to Dialogflow using Asterisk's new External Media capability from 16.6 onwards

## Requirements

* Node 10+
* Asterisk 16.6 onwards
* [Asterisk-Dialogflow-RTP-AudioServer](https://github.com/nimbleape/asterisk-dialogflow-rtp-audioserver) running elsewhere
* MQTT Server

## Install

```
yarn
```

## Run

Set your config settings in `config/default.js` (or `config/production.js` if you're running with `NODE_ENV=production`)

```
yarn start
```

## Logging

This project uses Pino as it's logging library which outputs JSON to the console. You can make this easier ot read using `pino-pretty` or just use the `yarn start-pretty` command.

## Dockerfile

The included Dockerfile is very opinionated. It uses multi stage builds and then uses a "distroless" Node.js image from Google. there's no point exec'ing into it because there's no bash terminal available etc. Use it as Docker should be used :)
