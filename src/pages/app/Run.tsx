import { useParams } from "react-router";

function Run() {
  const { runId } = useParams<{ runId: string }>();

  return <div>Run {runId && runId}</div>;
}

export default Run;
