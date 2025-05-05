/**
 * Make some keys of an object optional
 * @example
 * type User = {
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 * type UserOptional = MakeOptional<User, "age"|"email">;
 * // { name: string; age?: number; email: string; email?: string; }
 */
export type MakeOptional<Type, Keys extends keyof Type> = {
  [K in keyof Type]: K extends Keys ? Type[K] | undefined | null : Type[K];
};


export type GetCompProps<T extends (...args: any[]) => any> = Parameters<T>[0];