const express = require("express");
const uglifyJs = require("uglify-js");
const bodyParser = require("body-parser");
const csso = require("csso");

const app = express();
const port = process.env.PORT || 9000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Max-Age", "3600");
    next();
});

app.all("/", (req, res) => {
    res.redirect(process.env.ORIGIN || "https://www.example.com");
    res.end();
});

app.use(bodyParser.json());

app.post("/compress/js", (req, res) => {
    const { code, map } = uglifyJs.minify(
        Buffer.from(req.body.code, "base64").toString(),
        {
            sourceMap: true,
        }
    );
    res.statusCode = 200;
    res.json({
        code: Buffer.from(code).toString("base64"),
        map: Buffer.from(map).toString("base64"),
    });
    res.end();
});

app.post("/compress/css", (req, res) => {
    const { css, map } = csso.minify(
        Buffer.from(req.body.code, "base64").toString(),
        {
            sourceMap: true,
        }
    );
    res.statusCode = 200;
    res.json({
        code: Buffer.from(css).toString("base64"),
        map: Buffer.from(JSON.stringify(map)).toString("base64"),
    });
    res.end();
});

app.listen(port, () => {
    console.log("[Express]", `APP Listening on port ${port}.`);
});
