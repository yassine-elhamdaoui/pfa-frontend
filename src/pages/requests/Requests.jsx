import JoinRequest from "../../components/joinRequest/JoinRequest";
import { hasRole } from "../../utils/userUtiles";
import NotFoundPage from "../notFoundPage/NotFoundPage";

function Requests() {
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  return isHOB ? (
    <div style={{display:"flex" , flexDirection:"column" , gap:"10px"}}>
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
      <JoinRequest />
    </div>
  ) : (
    <NotFoundPage />
  );
}

export default Requests;
