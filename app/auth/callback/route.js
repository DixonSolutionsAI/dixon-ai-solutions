import { NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "../../../lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/workspace?auth_error=1", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/workspace?auth_error=1" : "/workspace", url.origin));
}
