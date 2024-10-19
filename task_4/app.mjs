//Задача 4. Розробити серверну частину додатку, який за відповідними маршрутами (“/”, “/coffee”, “/music”) повертає створені HTML документи (розмістіть їх там же, де і додаток), що описують: інформацію про себе, інфорімацію про улюблену кав’ярню,  інформацію про улюблений музичний гурт.

import { createServer } from "node:http"
import fs from "fs"
import path from 'path'

const server = createServer((req, res) => {
    let fileName = req.url.slice(1) || "index.html"

    const extname = path.extname(fileName)
    let contentType = "text/html"

    switch (extname) {
        case ".css":
            contentType = "text/css"
            break
        case ".js":
            contentType = "text/javascript"
            break
        case ".json":
            contentType = "application/json"
            break
        case ".png":
            contentType = "image/png"
            break
        case ".jpg":
            contentType = "image/jpg"
            break
        case ".gif":
            contentType = "image/gif"
            break
        case ".svg":
            contentType = "image/svg+xml"
            break
        default:
            contentType = "text/html"
    }

    if (fs.existsSync(fileName)) {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    "Content-Type": "text/plain; charset=utf-8",
                })
                res.end("Сторінки з такою адресою не існує")
                return
            }
            res.writeHead(200, { contentType })
            res.end(data)
        })
    } else {
        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("File not found")
    }
})

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000")
})
