const request = require('request').defaults({ encoding: null });
const http = require('http');
const url = require("url");
const path = require("path");
const fs = require("fs");

function handleError(err, res, statusCode, message) {
    if (err) {
        res.statusCode = 500;
        res.write("Internal Server Error");
    } else {
        res.statusCode = statusCode;
        res.write(message);
    }
    res.end();
}

http.createServer(async function (req, res) {
    if (req.method === "POST") {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = JSON.parse(Buffer.concat(buffers).toString());

        if (data.url.startsWith("file://")) {
            let filePath = url.fileURLToPath(data.url);
            let copyPath = path.join(data.pathToLoad, data.newFileName);
            fs.copyFile(filePath, copyPath, (err) => {
                handleError(err, res, 200, "Success");
            });
        } else {
            request.get(data.url, null, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let buffer = Buffer.from(body);
                    fs.writeFile(path.join(data.pathToLoad, data.newFileName), buffer, 'binary',(err) => {
                        handleError(err, res, 200, "Success");
                    });
                } else {
                    handleError(error, res, 400, "Picture by given URL is unavailable");
                }
            });
        }
    } else {
        res.statusCode = 501;
        res.write(`Method ${req.method} is not supported`);
        res.end();
    }
}).listen(4000);
