// fs es un módulo que permite interactuar con los archivos del sistema, fs-extra contiene todas las funcionalidades de fs junto con otras mejoradas.
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteImg = async(nameImage) => {
    try {
        await fs.unlink(path.resolve(__dirname, "../storage/imgs", nameImage))
    } catch (error) {
        console.log("Error en la función deleteImg", error.message)
    }
}