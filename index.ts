import {
    closeStream,
    createStream,
    getProgress,
    saveProgress,
    writeToFile,
} from "./fileLogger";
import puppeteer, { Page } from "puppeteer";

let page: Page;

(async () => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(getProgress());

    await scrape(5000, 1000);

    saveProgress(page.url());

    browser.close();
})();

const scrape = async (nrOfWords: number, maxFileSize: number) => {
    for (let i = 0; i < nrOfWords / maxFileSize; i++) {
        await iterateWords(maxFileSize);
    }
};

const iterateWords = async (nrOfWords: number) => {
    const stream = createStream();
    for (let i = 0; i < nrOfWords; i++) {
        const transcription = await getWord();
        writeToFile(stream, transcription);
        await navigateNextWord();
        await page.waitForSelector(".translation");
    }
    closeStream(stream);
};

const getWord = async () => {
    const word = await page.$eval(".translation", (el) =>
        el.innerHTML.toString()
    );
    const foundPosition = word.indexOf(
        '<span class="found">Търсената дума е намерена</span>'
    );
    const transcription = word
        .substring(0, foundPosition)
        .split("<br>")
        .map((w) => w.trim())
        .filter((w) => !!w.length);
    console.log(transcription);
    return transcription;
};

const navigateNextWord = async () => {
    await page.click("#wordsList > a:nth-child(3)");
};
