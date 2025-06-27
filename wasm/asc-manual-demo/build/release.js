console.log("loaded build/release.js");
// 创建 Webassembly 模块
async function instantiate(module, imports = {}) {
  // Webassembly 在浏览器中和 nodejs 中均存在， instantiate 用来创建 Webassembly 模块
  const { exports } = await WebAssembly.instantiate(module, imports);

  // 获取到内存
  // const memory = exports.memory || imports.env.memory;

  return exports;
}

export const { add, fib } = await (async (url) =>
  instantiate(
    await (async () => {
      const isNodeOrBun =
        typeof process !== "undefined" &&
        !!process.versions &&
        (!!process.versions.node || !!process.versions.bun);

      // 用户检测， 浏览器使用 Webassembly.compileStreaming ， Node: Webassembly.compile
      if (isNodeOrBun) {
        // Node: Webassembly.compile
        // 读取文件
        const fs = await import("node:fs/promises");
        return await globalThis.WebAssembly.compile(await fs.readFile(url));
      } else {
        // 浏览器
        return await globalThis.WebAssembly.compileStreaming(
          globalThis.fetch(url)
        );
      }
    })()
  ))(new URL("release.wasm", import.meta.url));
