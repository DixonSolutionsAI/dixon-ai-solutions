"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "../../lib/supabase/server";

export async function createCompany(formData) {
  if (!isSupabaseConfigured()) redirect("/workspace?error=configuration");
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
    redirect("/workspace?error=name");
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/workspace");

  const { error } = await supabase.rpc("create_company", { company_name: name.trim() });
  if (error) {
    console.error("Company creation failed", error.code);
    redirect("/workspace?error=create");
  }
  redirect("/workspace?created=1");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out failed", error.code);
      redirect("/workspace?error=signout");
    }
  }
  redirect("/workspace");
}
