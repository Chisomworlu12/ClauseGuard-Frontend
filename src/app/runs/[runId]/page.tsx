export const instant = false;

import RunDetailsPage from "@/components/run-details-page";

export default async function RunDetailsRoute({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  return <RunDetailsPage runId={runId} />;
}
