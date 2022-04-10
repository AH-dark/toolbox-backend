const express = require("express");
const uglifyJs = require("uglify-js");
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

app.use(express.json({ limit: "2100000kb" }));

app.post("/compress/js", (req, res) => {
    const { code, map, error, warnings } = uglifyJs.minify(
        Buffer.from(req.body.code, "base64").toString("utf8"),
        {
            sourceMap: true,
        }
    );
    if (error) {
        res.statusCode = 200;
        res.json({
            error: Buffer.from(error.message, "utf8").toString("base64"),
        });
        res.end();
        return;
    }
    res.statusCode = 200;
    res.json({
        code: Buffer.from(code, "utf8").toString("base64"),
        map: req.query.map
            ? Buffer.from(map, "utf8").toString("base64")
            : undefined,
        warnings: warnings
            ? Buffer.from(JSON.stringify(warnings), "utf8").toString("base64")
            : undefined,
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
