import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasEnvVars = supabaseUrl && supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * @deprecated 不推荐使用，请使用 createBrowserSupabase 或 createServerSupabase 替代, 仅学习而使用
 * 主要功能：
 * 1. 创建一个通用的 Supabase 客户端实例，用于服务端/客户端
 * 2. 支持所有环境：浏览器、Node.js（服务端）、Edge Runtime 。
 * 3. 提供基本的客户端功能，如数据查询、认证等。
 *
 * 不自动管理 Cookie 的 Session。
 * 如果你在 SSR 应用中直接使用它，Auth 状态可能和服务端不一致
 *
 */
export const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
