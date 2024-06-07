import { useSearchParams } from 'react-router-dom';

function BackLog() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  console.log(projectId);
  return <div>BackLog</div>;
}

export default BackLog