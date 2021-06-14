const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

let messageLIST = [];

const requestListener = function (req, res) {
    console.log(
        `Request: ${req.method}, ${req.url}`
    );
    console.log(
        `Request headers: ${JSON.stringify(req.headers)}`
    );

    let fileName;
    let contentType;
    if (req.method === 'POST') {
        let data = "";

        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            messageLIST.push(JSON.parse(data))
            res.end();
        })
        return;
    } else if (req.url === "/db" && req.method === 'GET') {
        let str = "";
        for (let msg of messageLIST) {
            str = str + JSON.stringify(msg) + ';';
        }
        res.writeHead(200);
        res.end(str);
        return;
        //res.end(getMessages());
    }
    if (req.url === "/") {
        fileName = "index.html";
        contentType = "text/html";
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

function getMessages() {
    let msgDB = [];
    for (let msg of messageLIST) {
        msgDB.push(msg);
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});