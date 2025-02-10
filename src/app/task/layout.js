'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // You can add a loading spinner here
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }
}