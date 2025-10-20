import fs from "fs";
import path from "path";

export async function readData(filename) {
  const filePath = path.join(process.cwd(), "app/data", filename);
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("讀取失敗:", err);
    return [];
  }
}

export async function writeData(filename, data) {
  const filePath = path.join(process.cwd(), "app/data", filename);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

// 存檔上傳檔案
export async function saveFile(file, destPath) {
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(destPath, buffer);
}
