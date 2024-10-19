// Задача 2. Користувач через роут ‘/save_num/число’ може передати на сервер якесь число. Ці числа поступово треба зберігати у текстовому файлі numbers.txt. Наприклад, використовуючи такий роут:
// http://localhost:3000/save_num/78  -  у файл треба додати число 78.
// А використовуючи роути  ‘/sum’ – знайти суму, ‘mult’ –знайти добуток. За роутом «/remove» файл треба видалити.

import { createServer } from "node:http"
import { promises as fs } from "node:fs"

const numbersFileHistory = "number.txt"

const server = createServer(async (req, res) => {
	const pathName = req.url
	

    if (pathName.startsWith("/save_num/")) {
        await addNumberToFile(pathName, res)
    } else if (req.url === "/sum") {
        await getSum(res)
        return
    } else if (req.url === "/mult") {
        await getMult(res)
        return
    } else if (req.url === "/remove") {
        await deleteFile(numbersFileHistory)
        return
    } else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        res.end("<h2>Не знайдено файл на сервері</h2>")
    }
})
// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000")
})

async function getSum(res) {
    try {
        const numberArr = await readFileContent(numbersFileHistory, res)
        const sum = numberArr.reduce((prevS, el) => prevS + el, 0)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`Загальна сума: ${sum}`)
        return
    } catch (err) {
        console.log(err.message)
        res.writeHead(500, { "Content-Type": "text/html; charset=ut-8" })
        res.end("Помилка на сервері. Неможливо обчислити суму")
    }
}

async function getMult(res) {
    try {
        const numberArr = await readFileContent(numbersFileHistory, res)
        const mult = numberArr.reduce((prevS, el) => prevS * el, 1)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`Загальна сума: ${mult}`)
        return
    } catch (err) {
        console.log(err.message)
        res.writeHead(500, { "Content-Type": "text/html; charset=ut-8" })
        res.end("Помилка на сервері. Неможливо обчислити добуток")
    }
}

async function deleteFile(file) {
    try {
        await fs.unlink(file)
        console.log(`Файл ${file} успішно видалений`)
    } catch (err) {
        console.log(err.message)
    }
}

async function addNumberToFile(pathName, res) {
    const savePath = "/save_num/"
    const num =
        pathName.length >= savePath.length
            ? parseInt(pathName.split("/")[2])
            : null

    try {
        await fs.appendFile(numbersFileHistory, `${num}\n`)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`<h1>Число ${num} додано у файл </h1>`)
        return
    } catch (err) {
        console.log(err.message)
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("Помилка додачі числа")
    }
}
async function readFileContent(filePath, res) {
    try {
        const data = await fs.readFile(filePath, "utf8")
        const numArr = data
            .split("\n")
            .filter((el) => el.trim() !== "")
            .map((num) => Number(num))
            .filter((num) => !isNaN(num))
        return numArr
    } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
        res.end("На сервері помилка")
        throw err
    }
}
