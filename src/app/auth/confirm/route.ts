import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/auth/update-password";
}

function recoveryError(requestUrl: URL, code: string, description: string) {
  const errorUrl = new URL("/auth/forgot-password", requestUrl.origin);
  errorUrl.searchParams.set("error", code);
  errorUrl.searchParams.set("error_description", description);
  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = safeNext(requestUrl.searchParams.get("next"));
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const supabase = await createClient();

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    return recoveryError(requestUrl, error.code ?? "recovery_failed", error.message);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    return recoveryError(requestUrl, error.code ?? "recovery_failed", error.message);
  }

  return recoveryError(
    requestUrl,
    requestUrl.searchParams.get("error_code") ?? "missing_recovery_token",
    requestUrl.searchParams.get("error_description") ??
      "The recovery link is invalid or has expired.",
  );
}
