import { PDFParse } from "pdf-parse";
import fs from "fs";
const dataBuffer = Buffer.from("dummy data");
try {
  const parser = new PDFParse({ data: dataBuffer });
  console.log("Parser created:", parser);
} catch (e) {
  console.error("Error creating parser:", e.message);
}
