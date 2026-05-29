import { PDFParse } from "pdf-parse";
import fs from "fs";

async function test() {
  const dataBuffer = fs.readFileSync("test.pdf");
  try {
    const parser = new PDFParse();
    const result = await parser.getText(dataBuffer);
    console.log(result.text);
  } catch (err) {
    console.error(err);
  }
}
test();
