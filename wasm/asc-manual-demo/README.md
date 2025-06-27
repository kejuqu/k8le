---
theme: orange
highlight: atelier-sulphurpool-dark
---

> WebAssembly（wasm） 是**一种新的编码方式，可以在现代的 Web 浏览器中运行**——它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如 C/C++、C# 和 Rust 等语言提供编译目标，以便它们可以在 Web 上运行。 它也被设计为可以与 JavaScript 共存，允许两者一起工作

## 主要的应用场景

WebAssembly 的文件后缀为 .wasm, 使用场景为：

- 计算密集型任务， 比如借助 rust,c 等做非常复杂的计算
- 图形渲染，
- 音视频剪辑
- 高性能渲染库

## 如何使用 wasm

1. 编写代码
   在 index.ts 中写函数
2. 将代码编译为 wasm 文件
   npm run dev2， 查看 release.wat 中有 无 build 的函数
3. 在前端 page 使用 wasm
   index.html
4. 调用 wasm 提供的方法

比如 add 方法

## 跑测试

1. npm run dev2, 打开 http://localhost:3000 console 控制台查看
2. node ./node/test.js
