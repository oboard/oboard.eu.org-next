function align(input, output, sWidth, tWidth, sOffset, tOffset) {
  let offset = 0;
  let rest = 0;
  let i = 0,
    j = 0;
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
function toUint8Array(source) {
  return new TextEncoder().encode(source);
}
function encode(input) {
  if (typeof input === "string") {
    input = toUint8Array(input);
  }
  const output = new Uint16Array(Math.ceil((input.length * 4) / 7) + 1);
  align(input, output, 8, 14, 0, 0x4e00);
  output[output.length - 1] = (input.length % 7) + 0x3d00;
  return output;
}
function toUint16Array(source) {
  const input = new Uint16Array(source.length);
  for (let i = 0; i < source.length; i++) {
    input[i] = source.charCodeAt(i);
  }
  return input;
}
function toSource(input) {
  return String.fromCharCode(...input);
}
function decode(input) {
  if (typeof input === "string") {
    input = toUint16Array(input);
  }
  const length = input.length - 1;
  const residue = input[length] - 0x3d00 || 7;
  const output = new Uint8Array(Math.floor((length - 1) / 4) * 7 + residue);
  align(input, output, 14, 8, 0x4e00, 0);
  return output;
}
const str = "";
const encoded = encode(str);
const encodedStr = toSource(encoded);
const decoded = decode(encoded);
const decodedStr = toSource(decode(decoded));
console.log(str);
console.log(encoded);
console.log(encodedStr);
console.log(decoded);
console.log(decodedStr);
