import './style.css';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';

let editor: EditorView;

window.addEventListener('DOMContentLoaded', () => {
  editor = new EditorView({
    state: EditorState.create({
      doc: 'roar "Hello World!"',
      extensions: [basicSetup, oneDark],
    }),
    parent: document.getElementById('animalCode')!
  });

  loadWasm();
});

async function loadWasm() {
  const go = new (window as any).Go();
  const result = await WebAssembly.instantiateStreaming(fetch("/animal.wasm"), go.importObject);
  await go.run(result.instance);
  console.log("WASM Loaded");
}

(window as any).runAnimal = function () {
    const code = editor.state.doc.toString();
    const output = document.getElementById("output")!;
    const runBtn = document.querySelector(".run-button") as HTMLButtonElement;
  
    runBtn.innerText = "Running...";
    runBtn.disabled = true;
  
    try {
      const result = (window as any).runAnimalCode(code);
      output.textContent = result;
    } catch (err) {
      output.textContent = "Error: " + (err as Error).message;
    }
  
    runBtn.innerText = "Run";
    runBtn.disabled = false;
  };
  
  (window as any).clearOutput = function () {
    const output = document.getElementById("output")!;
    output.textContent = '';
  };
  
