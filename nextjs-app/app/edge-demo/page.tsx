import { createServerSupabase } from "@/lib/supabase/server";

export default async function EdgeFuncPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.functions.invoke("hellou", {
    body: { name: "Functions" },
  });

  if (error) {
    return (
      <div>
        <pre className="text-red-500">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
