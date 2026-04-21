import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveRoleHomePath, resolveRoleScope } from "@/features/umkm/utils/roleRouting";

/**
 * Proxy enforces authentication and role-based route access.
 */
export default auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const safeRedirectToHome = (homePath: string) => {
    if (homePath === pathname) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(homePath, req.url));
  };

  if (pathname.startsWith("/umkm-admin")) {
    return NextResponse.redirect(new URL(pathname.replace("/umkm-admin", "/admin"), req.url));
  }

  if (pathname.startsWith("/umkm-user")) {
    return NextResponse.redirect(new URL(pathname.replace("/umkm-user", "/user"), req.url));
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  if (pathname === "/profil-umkm") {
    return NextResponse.redirect(new URL("/user/profil-umkm", req.url));
  }

  if (pathname === "/pengajuan") {
    return NextResponse.redirect(new URL("/user/pengajuan", req.url));
  }

  const roleName = req.auth?.user?.role;
  const roleSlug = req.auth?.user?.roleSlug;
  const roleScope = resolveRoleScope(roleSlug, roleName);
  const homePath = resolveRoleHomePath(roleSlug, roleName);
  const isUserArea = pathname.startsWith("/user");
  const isAdminArea = pathname.startsWith("/admin");
  const isSuperadminArea = pathname.startsWith("/superadmin");

  if (!isLoggedIn && (isUserArea || isAdminArea || isSuperadminArea)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isSuperadminArea && roleScope !== "superadmin") {
    return safeRedirectToHome(homePath);
  }

  if (isAdminArea && roleScope !== "admin" && roleScope !== "superadmin") {
    return safeRedirectToHome(homePath);
  }

  if (isUserArea && roleScope !== "user") {
    return safeRedirectToHome(homePath);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
    "/user/:path*",
    "/umkm-admin/:path*",
    "/umkm-user/:path*",
    "/dashboard",
    "/profil-umkm",
    "/pengajuan",
  ],
};
