import { hasRole } from "../../utils/userUtiles";
import NotFoundPage from "../notFoundPage/NotFoundPage";

function Requests() {
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  return isHOB ? (
    <div>
      <h1>Requests</h1>
    </div>
  ) : (
    <NotFoundPage />
  );
}

export default Requests;
