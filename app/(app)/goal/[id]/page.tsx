"use client";

import { useParams } from "next/navigation";
import { GoalPlaybook } from "@/components/goal/GoalPlaybook";

export default function GoalPage() {
  const params = useParams<{ id: string }>();
  return (
    <div className="mx-auto max-w-3xl">
      <GoalPlaybook id={String(params.id)} />
    </div>
  );
}
