import fs from "fs";

const wordlistText = fs.readFileSync("./wordlist.txt").toString();

const words = wordlistText
    .split(/\r?\n/)
    .filter((w) => !w.charAt(0).match(/[А-Я]/))
    .filter((w) => w.length > 1)
    .map((w) => (w.includes("/") ? w.split("/")[0] : w));

fs.writeFileSync("./files/wordlist.txt", words.join("\n"), { flag: "w" });
