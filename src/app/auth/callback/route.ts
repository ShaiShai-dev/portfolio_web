import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/auth/update-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    const errorUrl = new URL("/auth/forgot-password", requestUrl.origin);
    errorUrl.searchParams.set("error", error.code ?? "recovery_failed");
    errorUrl.searchParams.set("error_description", error.message);
    return NextResponse.redirect(errorUrl);
  }

  const errorUrl = new URL("/auth/forgot-password", requestUrl.origin);
  errorUrl.searchParams.set(
    "error",
    requestUrl.searchParams.get("error_code") ?? "missing_recovery_code",
  );
  errorUrl.searchParams.set(
    "error_description",
    requestUrl.searchParams.get("error_description") ??
      "The recovery link is invalid or has expired.",
  );
  return NextResponse.redirect(errorUrl);
}
