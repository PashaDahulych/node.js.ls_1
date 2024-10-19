// Задача 5. Створити додаток з історією. У файлі json зберігаємо усі роути та кількість відвідувань. У налаштуваннях settings.json зберігати який роут треба використати для перегляду історії та назву файлу де зберігається історія

import { createServer } from "node:http"
import fs from "fs"
import settings from "./settings.json" assert { type: "json" }

const server = createServer((req, res) => {
    const historyFile = settings.historyFilePath

    // Якщо запит на маршрут перегляду історії
    if (req.url === settings.historyRout) {
        if (fs.existsSync(historyFile)) {
            fs.readFile(historyFile, (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" })
                    res.end("Sorry, file corrupted")
                    return
                }
                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(data)
            })
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" })
            res.end("History file not found")
        }
    } else {
        // Якщо інший маршрут, додаємо його до історії
        fs.readFile(historyFile, (err, data) => {
            let history = {}

            if (!err && data.length > 0) {
                try {
                    history = JSON.parse(data) // Парсимо існуючу історію
                } catch (err) {
                    console.error("Error parsing history file", err)
                    res.writeHead(500, { "Content-Type": "text/plain" })
                    res.end("Error parsing history file")
                    return
                }
            }

            // Оновлюємо або додаємо новий маршрут
            if (history[req.url]) {
                history[req.url] += 1 // Збільшуємо кількість відвідувань
            } else {
                history[req.url] = 1 // Додаємо новий маршрут з лічильником 1
            }

            // Записуємо оновлену історію у файл
            fs.writeFile(
                historyFile,
                JSON.stringify(history, null, 2),
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" })
                        res.end("Failed to save route to history")
                    } else {
                        res.writeHead(200, { "Content-Type": "text/plain" })
                        res.end("Route added to history")
                    }
                }
            )
        })
    }
})

// Запускаємо сервер на 3000 порту
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000")
})

