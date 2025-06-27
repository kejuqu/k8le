import { add, fib } from "../build/release.js";

//  performance 做一个性能的评估
performance.mark("wasm_start");
console.log(add(1, 2));
performance.mark("wasm_end");
performance.measure("wasm_time", "wasm_start", "wasm_end");

console.log(performance.getEntriesByName("wasm_time"));

console.log("------------ wasm_add end -------------");
function add_inweb(a, b) {
  let res = 0;
  for (let i = 0; i < 100000000; i++) {
    res += a;
  }

  return res + b;
}

performance.mark("js_start");
console.log(add_inweb(1, 2));
performance.mark("js_end");
performance.measure("js_time", "js_start", "js_end");

console.log(performance.getEntriesByName("js_time"));

console.log("------------ js_add end -------------");

performance.mark("wasm_fib_start");
console.log(fib(80));
performance.mark("wasm_fib_end");
performance.measure("wasm_fib_time", "wasm_fib_start", "wasm_fib_end");

console.log(performance.getEntriesByName("wasm_fib_time"));

console.log("------------ wasm_fib end -------------");

function normal_fib(n) {
  if (n <= 0) return 0;
  if (n === 1 || n === 2) return 1;

  let a = 1,
    b = 1; // 初始化前亮相
  for (let i = 3; i <= n; i++) {
    const next = a + b; // 计算下一个数
    a = b; // 指针后移
    b = next;
  }

  return b; // 返回第 n 项的值
}

performance.mark("normal_fib_start");
console.log(normal_fib(80));
performance.mark("normal_fib_end");
performance.measure("normal_fib_time", "normal_fib_start", "normal_fib_end");

console.log(performance.getEntriesByName("normal_fib_start"));

console.log("------------ normal_fib end -------------");
