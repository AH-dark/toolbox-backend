const express = require("express");
const uglifyJs = require("uglify-js");
const csso = require("csso");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 9000;
const frontendDomain = process.env.FRONTEND;

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.NODE_ENV === "development" ? "*" : frontendDomain
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,X-Domain-Validate"
    );
    res.setHeader("Access-Control-Max-Age", "3600");
    if (process.env.NODE_ENV !== "development") {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    next();
});

app.all("/", (req, res) => {
    res.redirect(process.env.FRONTEND || "https://www.example.com");
    res.end();
});

app.use(express.json({ limit: "2100000kb" }));

const md5 = crypto.createHash("md5");
const hash = md5.update(String(frontendDomain)).digest("hex");

app.use((req, res, next) => {
    if (req.method === "POST") {
        const headerMd5 = req.header("X-Domain-Validate");
        if (hash.toString().toUpperCase() !== headerMd5) {
            console.log(
                "[Express]",
                "Domain check error |",
                "Frontend MD5:",
                headerMd5,
                "| Backend MD5:",
                hash.toString().toUpperCase()
            );
            res.sendStatus(403);
            res.end();
            return;
        }
    }
    next();
});

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
    console.log("[Express]", "APP Mode:", process.env.NODE_ENV);
});
