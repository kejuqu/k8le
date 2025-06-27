import assert from "assert";
import { add, fib } from "../build/debug.js";

export function fib_non_wasm(n) {
  if (n <= 0) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}

assert.strictEqual(add(1, 2), 3);

console.time("non-wasm fib");
console.log(fib_non_wasm(50));
console.timeEnd("non-wasm fib");

console.time("wasm fib");
console.log(fib(50));
console.timeEnd("wasm fib");
