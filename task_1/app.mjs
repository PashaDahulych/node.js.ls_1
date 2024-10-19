// Задача 1. У консольний додаток передають через параметр пенсійний вік. Наприклад node app.mjs –-pension=65 Потім питаємо у терміналі користувача скільки йому років (використати “readline”) і кажемо чи він є пенсіонером.

import { argv } from "process"
import readline from "readline"

const argsList = argv.slice(2).join("&")
const args = new URLSearchParams(argsList)
console.log("age =" + args.get("--pension"))

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.setPrompt("What is your age?")
rl.prompt()

rl.on("line", (age) => {
    const argsAge = parseInt(args.get("--pension"))
    const ageInp = parseInt(age)
    if (argsAge <= ageInp) console.log("User is pensioner")
    else console.log(`User is ${age} years old`)
    rl.close()
})
