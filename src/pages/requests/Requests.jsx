import { useEffect, useState } from "react";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import JoinRequest from "../../components/joinRequest/JoinRequest";
import { hasRole } from "../../utils/userUtiles";
import NotFoundPage from "../notFoundPage/NotFoundPage";
import { getJoinRequests } from "../../services/joinRequestsService";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import { acceptUser, rejectUser } from "../../services/authService";
import { Alert, Skeleton, Snackbar } from "@mui/material";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import JoinRequestSkeleton from "../../components/joinRequest/JoinRequestSkeleton";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

const token = localStorage.getItem("token");
function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

      const [confirmLoading, setConfirmLoading] = useState(false);
      const [openDialog, setOpenDialog] = useState(false);
      const [isAcceptConfirmation, setIsAcceptConfirmation] = useState(true);
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [selectedUser, setSelectedUser] = useState({});
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const fetchedRequests = await getJoinRequests(token);
        setRequests(fetchedRequests);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);
  console.log(selectedUser);
  console.log(requests);
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  return isHOB ? (
    loading ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
              <Skeleton
                variant="rectangular"
                height={25}
                sx={{ borderRadius: "20px" }}
                width={170}
                animation="wave"
              />
        </div>
        <div style={{display:"flex" , justifyContent:"center" ,flexDirection:"column",gap:"10px"}}>
            <JoinRequestSkeleton />
            <JoinRequestSkeleton />
            <JoinRequestSkeleton />
            <JoinRequestSkeleton />
            <JoinRequestSkeleton />
            <JoinRequestSkeleton />
        </div>
      </div>
    ) : (
      requests.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Requests", href: "/requests" },
          ]}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => setSelectedUser(request.user.id)}
            >
              <JoinRequest
                key={request.id}
                request={request}
                setOpenDialog={setOpenDialog}
                setIsAcceptConfirmation={setIsAcceptConfirmation}
                setSelectedUser={setSelectedUser}
              />
            </div>
          ))}
        </div>
        <ConfirmationDialog
          message={
            isAcceptConfirmation
              ? "Are you sure you want to accept this user?"
              : "Are you sure you want to refuse this user?"
          }
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleConfirmClick={() =>
            isAcceptConfirmation
              ? acceptUser(
                  token,
                  selectedUser,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
              : rejectUser(
                  token,
                  selectedUser,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
          }
          setLoading={setConfirmLoading}
          loading={confirmLoading}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={
              snackbarMessage &&
              (snackbarMessage.includes("accepted") ||
                snackbarMessage.includes("rejected"))
                ? "success"
                : "error"
            }
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>) : (
        <>
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Requests", href: "/requests" },
          ]}
        />
        <PlaceHolder
          icon={DoNotDisturbAltIcon}
          title="No requests found"
          message="There are no requests to show"
        />
        </>
      )
    )
  ) : (
    <PlaceHolder
      icon={DoNotDisturbAltIcon}
      title="You are not authorized"
      message="You can't view this page ,contact the admin for more information"
    />
  );
}

export default Requests;
