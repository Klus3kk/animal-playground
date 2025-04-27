import './style.css';
import { Go } from './wasm_exec';

async function loadWasm() {
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(fetch("/animal.wasm"), go.importObject);
    go.run(result.instance);
    console.log("WASM Loaded!");
}

function runAnimal() {
    const code = (document.getElementById("animalCode") as HTMLTextAreaElement).value;
    try {
        const output = (window as any).runAnimalCode(code);
        (document.getElementById("output") as HTMLElement).innerText = output;
    } catch (err) {
        (document.getElementById("output") as HTMLElement).innerText = "Error: " + err;
    }
}

(window as any).runAnimal = runAnimal;

loadWasm();
