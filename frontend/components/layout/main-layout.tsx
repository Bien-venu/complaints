"use client";

import type React from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCurrentUser } from "@/redux/slices/authSlice";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const hasAccess =
    allowedRoles.includes(user?.role || "") ||
    (user?.role?.toLowerCase().includes("admin") &&
      user?.role?.toLowerCase() !== "sector_admin");

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login");
      } else if (isAuthenticated && allowedRoles.length > 0 && !hasAccess) {
        if (pathname === "/messages") {
          
        } else {
          router.push("/");
        }
      }
    }
  }, [
    isAuthenticated,
    loading,
    requireAuth,
    allowedRoles,
    user,
    router,
    pathname,
    hasAccess,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }
  
  if (isAuthenticated && allowedRoles.length > 0 && !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
