#!/usr/bin/env node
const { run } = require("supervisor");

process.env.NODE_ENV = "development";

const args = ["--watch", ".", __dirname + "/../index.js"];

run(args);
