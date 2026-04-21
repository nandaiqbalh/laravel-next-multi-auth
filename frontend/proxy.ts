import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Proxy enforces authentication and role-based route access.
 */
export default auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user?.role;
  const isUserArea = pathname === "/dashboard" || pathname.startsWith("/umkm-user") || pathname.startsWith("/profil-umkm") || pathname.startsWith("/pengajuan");
  const isAdminArea = pathname.startsWith("/umkm-admin");
  const isSuperadminArea = pathname.startsWith("/superadmin");

  if (!isLoggedIn && (isUserArea || isAdminArea || isSuperadminArea)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isSuperadminArea && role !== "SUPERADMIN") {
    if (role === "UMKM_ADMIN") {
      return NextResponse.redirect(new URL("/umkm-admin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/umkm-user/dashboard", req.url));
  }

  if (isAdminArea && role !== "UMKM_ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/umkm-user/dashboard", req.url));
  }

  if (isUserArea && role !== "UMKM_USER") {
    if (role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/umkm-admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/dashboard", "/profil-umkm", "/pengajuan", "/umkm-user/:path*"],
};
