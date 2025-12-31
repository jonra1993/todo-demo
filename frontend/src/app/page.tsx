"use client";

import { Suspense } from "react";
import { Authenticated } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <Suspense>
      <Authenticated key="home-page">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Redirigiendo...</div>
        </div>
      </Authenticated>
    </Suspense>
  );
}
