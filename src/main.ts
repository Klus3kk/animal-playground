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

  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = (reader.result as string)
        .replace(/\r/g, '')
        .replace(/\uFEFF/g, '')
        .replace(/[^\x00-\x7F]/g, '');
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: content }
      });
    };
    reader.readAsText(file);
  });

  loadWasm();
});

async function loadWasm() {
  const go = new (window as any).Go();
  const result = await WebAssembly.instantiateStreaming(fetch("./animal.wasm"), go.importObject);
  await go.run(result.instance);
  console.log("WASM Loaded");
}

(window as any).runAnimal = async function () {
  const code = editor.state.doc.toString();
  const output = document.getElementById("output")!;
  const runBtn = document.querySelector(".run-button") as HTMLButtonElement;

  // Prevent re-entry
  runBtn.disabled = true;
  runBtn.innerText = "Running...";
  output.textContent = ''; // Clear first — always

  // Small timeout gives DOM a chance to reflect the clear
  await new Promise(resolve => setTimeout(resolve, 10));

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
