// Задача 3. Через параметри запиту передають операцію (add, subtract, mult) і числа (розділені дефісами), які треба опрацювати. Знайти результат і повернути користувачу. Наприклад при запиті:
// http://localhost:3000/add/12-4-23-45   - треба знайти суму чисел 12,4,23,45

import { createServer } from "node:http"
import url from "node:url"

const server = createServer((req, res) => {
    const parseUrl = url.parse(req.url, true)
    const pathName = parseUrl.pathname
    if (pathName.startsWith("/add/")) return handleAddNum(pathName, res)
    else if (pathName.startsWith("/subtract/"))
        return handleSubtract(pathName, res)
    else if (pathName.startsWith("/mult/")) return handleMultNum(pathName, res)
    else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        res.end("<h2>Не знайдено файл</h2>")
    }
})
// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000")
} )


function handleAddNum(pathName, res) {
    const number = getNumberFromUrl(pathName)

    try {
        const sum = getSum(number)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Сума: ${sum}</h1>`)
    } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Неможливо обчислити суму</h1>`)
        throw err
    }
}

function handleSubtract(pathName, res) {
    const number = getNumberFromUrl(pathName)

    try {
        const sum = getSubtract(number)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Віднімання: ${sum}</h1>`)
    } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Неможливо обчислити добуток</h1>`)
        throw err
    }
}

function handleMultNum(pathName, res) {
    const number = getNumberFromUrl(pathName)

    try {
        const sum = getMult(number)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Добуток: ${sum}</h1>`)
    } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Неможливо обчислити добуток</h1>`)
        throw err
    }
}

function getNumberFromUrl(pathName) {
    const numPath = pathName.split("/")[2]
    const numArr = numPath
        .split("-", numPath.length)
        .map(Number)
        .filter((num) => !isNaN(num))
    return numArr
}


function getSum(numbers) {
    if (numbers.length === 0) return 0
    return numbers.reduce((prevS, num) => prevS + num, 0)
}

function getSubtract(numbers) {
    if (numbers.length === 0) return 0
    return numbers.reduce((prevS, num) => prevS - num)
}

function getMult(numbers) {
    if (numbers.length === 0) return 0
    return numbers.reduce((prevS, num) => prevS * num, 1)
}
