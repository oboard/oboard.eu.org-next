"use client";
import { useState } from "react";

type TypedArray = Uint8Array | Uint16Array;

function align(
  input: TypedArray,
  output: TypedArray,
  sWidth: number,
  tWidth: number,
  sOffset: number,
  tOffset: number
) {
  let offset = 0;
  let rest = 0;
  let i = 0;
  let j = 0;
  const mask = (1 << tWidth) - 1;
  while (i < input.length) {
    const char = input[i] - sOffset;
    offset += sWidth;
    while (offset >= tWidth) {
      offset -= tWidth;
      output[j++] = rest + (char >> offset) + tOffset;
      if (j === output.length) return;
      rest = 0;
    }
    rest += (char << (tWidth - offset)) & mask;
    i++;
  }
  if (offset) {
    output[j++] = rest + tOffset;
  }
}

function toUint8Array(source: string) {
  return new TextEncoder().encode(source);
}

function encode(input: string | Uint8Array) {
  let inputArray: Uint8Array;
  if (typeof input === "string") {
    inputArray = toUint8Array(input);
  } else {
    inputArray = input;
  }

  const output = new Uint16Array(Math.ceil((inputArray.length * 4) / 7) + 1);
  align(inputArray, output, 8, 14, 0, 0x4e00);
  output[output.length - 1] = (inputArray.length % 7) + 0x3d00;
  return output;
}

function toUint16Array(source: string) {
  const input = new Uint16Array(source.length);
  for (let i = 0; i < source.length; i++) {
    input[i] = source.charCodeAt(i);
  }
  return input;
}

function toSource(input: Uint16Array): string {
  return String.fromCharCode(...input);
}

function decode(input: string | Uint16Array) {
  let inputArray: Uint16Array;
  if (typeof input === "string") {
    inputArray = toUint16Array(input);
  } else {
    inputArray = input;
  }

  const length = inputArray.length - 1;
  const residue = inputArray[length] - 0x3d00 || 7;
  const outputLength = Math.floor((length - 1) / 4) * 7 + residue;
  if (outputLength < 0) {
    return new Uint8Array(0);
  }
  const output = new Uint8Array(outputLength);
  align(inputArray, output, 14, 8, 0x4e00, 0);
  return output;
}

export default function Base16384() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <h1 className="mt-16">Base16384</h1>
      <div className="flex flex-col">
        <label className="label">Input</label>
        <textarea
          value={input}
          placeholder="Enter text to encode or decode"
          className="textarea textarea-bordered"
          onChange={(e) => setInput(e.target.value)}
        />
        <label className="label">Output</label>
        <textarea
          value={output}
          className="textarea textarea-bordered"
          readOnly
        />
      </div>
      <div className="flex flex-row gap-4 mt-8">
        <button
          type="button"
          className="mt-4 btn"
          onClick={() => setOutput(toSource(encode(input)))}
        >
          Encode
        </button>
        <button
          type="button"
          className="mt-4 btn"
          onClick={() => setOutput(String.fromCharCode(...decode(input)))}
        >
          Decode
        </button>
      </div>
    </div>
  );
}
