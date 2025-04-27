import './style.css';

async function loadWasm() {
    const go = new (window as any).Go();
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
