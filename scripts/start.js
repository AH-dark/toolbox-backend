#!/usr/bin/env node
const { run } = require("supervisor");

process.env.NODE_ENV = "production";

const args = ["-i", ".", __dirname + "/../index.js"];

run(args);
