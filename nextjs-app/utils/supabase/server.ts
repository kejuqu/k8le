import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "@/config/supabase";
/**
 * 创建一个服务端 Supabase 客户端
 * 主要功能：
 * 导出了一个 createClient 异步函数，用于创建服务器端的 Supabase 客户端实例
 * 这个客户端实例可以用于在服务器端与 Supabase 数据库进行交互
 * 适合在 Next.js 的 Server Component 中使用
 *
 * @returns {Promise<ReturnType<typeof createServerClient>>}
 */
export const createServerSupabase = async <Database = any>() => {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
