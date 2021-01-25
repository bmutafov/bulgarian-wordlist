import fs from "fs";

interface ProgressJSON {
    url: string;
    fileNumber: number;
    words: number;
}

const PROGRESS_FILENAME = "./files/progress.json";

let fileNumber = 0;
let wordsCounter = 0;

export const createStream = () => {
    const fileName = `./files/words_${fileNumber++}.txt`;
    return fs.createWriteStream(fileName, { flags: "a" });
};

export const writeToFile = (
    stream: fs.WriteStream,
    transcription: string[]
) => {
    const data = transcription.join(";") + "\n";

    stream.write(data);

    wordsCounter++;
};

export const closeStream = (stream: fs.WriteStream) => {
    stream.close();
};

export const saveProgress = (url: string) => {
    const progress: ProgressJSON = {
        url,
        fileNumber,
        words: wordsCounter,
    };

    fs.writeFileSync(PROGRESS_FILENAME, JSON.stringify(progress), {
        flag: "w",
    });
};

export const getProgress = (): string => {
    const progress = JSON.parse(
        fs.readFileSync(PROGRESS_FILENAME).toString()
    ) as ProgressJSON;
    fileNumber = progress.fileNumber;
    wordsCounter = progress.words;
    return progress.url;
};
