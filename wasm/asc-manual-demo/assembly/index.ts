export function add(a: number, b: number): number {
  let res: number = 0;
  for (let i: number = 0; i < 100000000; i++) {
    res += a;
  }

  return res + b;
}

export function sub(a: number, b: number): number {
  return a - b;
}

export function fib(n: number): number {
  if (n <= 0) return 0;
  if (n === 1 || n === 2) return 1;

  let a: number = 1,
    b: number = 1; // 初始化前亮相
  for (let i: number = 3; i <= n; i++) {
    const next: number = a + b; // 计算下一个数
    a = b; // 指针后移
    b = next;
  }

  return b; // 返回第 n 项的值
}
