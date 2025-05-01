import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/config/supabase";

/**
 * 创建一个浏览器端的 Supabase 客户端 【适合在 Client Component 中使用】
 * 主要功能：
 * 导出了一个 createBrowserSupabase 函数，用于创建浏览器端的 Supabase 客户端实例
 * 这个客户端实例可以用于在浏览器端与 Supabase 数据库进行交互
 * createBrowserClient 是专为浏览器环境优化的 SSR 友好型客户端，主要用于 Next.js 等 SSR 框架中。
 *
 * @returns {ReturnType<typeof createBrowserClient>}
 */
export const createBrowserSupabase = () =>
  createBrowserClient(supabaseUrl!, supabaseAnonKey!);
