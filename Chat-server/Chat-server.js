const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

let messageLIST = [];
let dataBase = [];

const requestListener = function (req, res) {
    console.log(
        `Request: ${req.method}, ${req.url}`
    );

    let fileName;
    let contentType;
    if (req.method === 'POST') {
        let data = "";

        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            dataBase.push(JSON.parse(data));
            messageLIST.push(JSON.parse(data));
            res.end();
        })
        return;
    } else if (req.url === "/db" && req.method === 'GET') {
        let str = "";
        let msg;
        while ((msg = messageLIST.shift()) != null) {
            str = str + JSON.stringify(msg) + ';';
        }
        res.writeHead(200);
        res.end(str);
        return;
    }
    if (req.url === "/") {
        fileName = "index.html";
        contentType = "text/html";
        for (let msg of dataBase)
            messageLIST.push(msg);
    }
    else if (req.url.endsWith(".css")) {
        fileName = req.url.substr(1);
        contentType = "text/css";
    } else {
        res.writeHead(500);
        res.end("Error, unsupported");
        return;
    }

    fs.readFile(`${__dirname}/${fileName}`)
        .then(contents => {
            res.setHeader("Content-Type", contentType);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});