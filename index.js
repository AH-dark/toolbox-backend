const express = require("express");
const uglifyJs = require("uglify-js");
const bodyParser = require("body-parser");
const csso = require("csso");

const app = express();
const port = process.env.PORT || 9000;

app.all("/", (req, res) => {
    res.redirect(process.env.ORIGIN || "https://www.example.com");
    res.end();
});

app.use(bodyParser.json());

app.post("/compress/js", (req, res) => {
    const { code, map } = uglifyJs.minify(req.body.code, {
        sourceMap: true
    });
    res.statusCode = 200;
    res.json({
        code: code,
        map: map,
    });
    res.end();
});

app.post("/compress/css", (req, res) => {
    const { css, map } = csso.minify(req.body.code, {
        sourceMap: true,
    });
    res.statusCode = 200;
    res.json({
        code: css,
        map: JSON.stringify(map),
    });
    res.end();
});

app.listen(port, () => {
    console.log("[Express]", `APP Listening on port ${port}.`);
});
