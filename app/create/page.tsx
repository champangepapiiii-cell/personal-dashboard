"use client";

import { PageStub } from "@/components/PageStub";
import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";
import { withinDays } from "@/lib/dates";

export default function CreatePage() {
  const { data } = useStore();
  const { days } = useTimeframe();

  const published = data.content.filter(
    (c) => c.status === "published" && c.publishedAt && withinDays(c.publishedAt, days),
  ).length;
  const inProgress = data.content.filter(
    (c) => c.status === "drafting" || c.status === "editing",
  ).length;
  const ideas = data.content.filter((c) => c.status === "idea").length;

  return (
    <PageStub
      title="Create"
      accent="var(--create)"
      description="Content pipeline — idea to published."
      stats={[
        { label: "Published", value: published },
        { label: "In progress", value: inProgress },
        { label: "Ideas", value: ideas },
        { label: "Total items", value: data.content.length },
      ]}
    />
  );
}
