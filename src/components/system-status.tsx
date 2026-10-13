"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/lib/api";

export default function SystemStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    getHealth().then(() => setStatus("online")).catch(() => setStatus("offline"));
  }, []);

  const label = status === "online" ? "API operational" : status === "offline" ? "API unavailable" : "Checking API";
  const color = status === "online" ? "bg-green" : status === "offline" ? "bg-red" : "bg-muted";

  return <span className="inline-flex items-center gap-2"><span className={"h-1.5 w-1.5 rounded-full " + color} />{label}</span>;
}
