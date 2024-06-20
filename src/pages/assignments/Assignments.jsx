import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { Avatar, AvatarGroup, Button, IconButton } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridTable from "../../components/gridTable/GridTable";
import GridTableSkeleton from "../../components/gridTable/GridTableSkeleton";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import {
  getAllPreferences,
  getAssignment,
  makeAssignment,
} from "../../services/projectService";
import { getAllTeams } from "../../services/teamService";
import { hasRole } from "../../utils/userUtiles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import { stringAvatar } from "../../utils/generalUtils";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { downLoadProfileImage } from "../../services/userService";
import { forEach } from "lodash";


const token = localStorage.getItem("token");
const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
// eslint-disable-next-line react/prop-types
function Assignments({ mode }) {
  const [openDialog , setOpenDialog] = useState(false);
  const handleMakeAssignment = () => {
    setOpenDialog(true);
  };

  const [teams, setTeams] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});

  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [responsiblesImages , setResponsiblesImages] = useState([]);
  const [membersImages , setMembersImages] = useState([]);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsAndPreferences = async () => {
      try {
        let academicYear;
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        if (month >= 9 && month <= 12) {
          academicYear = `${year}/${year + 1}`;
        } else if (month >= 1 && month <= 7) {
          academicYear = `${year - 1}/${year}`;
        }
        const fetchedTeams = await getAllTeams(token, academicYear);
        const fetchedPreferences = await getAllPreferences(token);
        const fetchedAssignment = await getAssignment(token);
        setTeams(fetchedTeams);
        setPreferences(fetchedPreferences);
        setAssignment(fetchedAssignment);
        forEach(fetchedTeams, async (team) => {
          if (team.responsible.profileImage === null) {
            // team.responsible.profileImage = stringAvatar(team.responsible.firstName);
          }else{
            const url = await downLoadProfileImage(team.responsible.id, token);
            setResponsiblesImages([...responsiblesImages, {id: team.responsible.id, url: url}]);
          }
        });

        forEach(fetchedTeams, async (team) => {
          team.members.forEach(async (member) => {
            console.log(member);
            if (member.profileImage === null) {
              // member.profileImage = stringAvatar(member.firstName);
            }else{
              const url = await downLoadProfileImage(member.id, token);
              setMembersImages([...membersImages, {id: member.id, url: url}]);
            }
          });
        });


        console.log(assignment);
        console.log(Object.keys(assignment).length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams and preferences:", error);
        setLoading(false);
      }
    };

    fetchTeamsAndPreferences();
  }, [assignmentLoading]);

  const teamsWithPreferences = getTeamsWithPreferences();
  const teamsWithoutPreferences = getTeamsWithoutPreferences();

  function getTeamsWithPreferences() {
    return teams.filter((team) =>
      preferences.some(
        (preference) => preference.user.id === team.responsible.id
      )
    );
  }

  function getTeamsWithoutPreferences() {
    return teams.filter(
      (team) =>
        !preferences.some(
          (preference) => preference.user.id === team.responsible.id
        )
    );
  }


  const handleInitiateAssignment = () => {
     makeAssignment(
      token,
      setSnackbarOpen,
      setSnackbarMessage,
      setAssignmentLoading
    );
  };

  const handleViewPreferences = (teamId) => {
    console.log(teamId);
    navigate(`/dashboard/project/team/${teamId}/preferences`);
  };

  console.log(membersImages);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerClassName: "custom-header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "responsible",
      headerName: "Responsible",
      width: 200,
      headerClassName: "custom-header",
      renderCell: (params) => (
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            src={responsiblesImages.find((image) => image.id === params.row.responsible.id)?.url}
            sx={{ height: "40px", width: "40px" }}
          />
        </IconButton>
      ),
    },


    
    {
      field: "members",
      headerName: "Members",
      headerClassName: "custom-header",
      width: 200,
      renderCell: (params) => (
        <AvatarGroup max={5}>
          {params.row.members.map((member) => (
            <Avatar
              key={member.id}
              src={membersImages.find((image) => image.id === member.id)?.url}
            />
          ))}
        </AvatarGroup>
      ),
    },
    {
      field: "hasPreferences",
      headerName: "Has Preferences",
      headerClassName: "custom-header",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.hasPreferences ? (
            <CheckCircleIcon sx={{ color: "green" }} /> // Replace GreenIcon with your green icon component
          ) : (
            <CancelIcon sx={{ color: "red" }} /> // Replace RedIcon with your red icon component
          )}
        </div>
      ),
    },
    {
      field: "preferences",
      headerName: "View Preferences",
      headerClassName: "custom-header",
      width: 200,
      renderCell: (params) =>
        params.row.hasPreferences ? (
          <Button
            variant="outlined"
            onClick={() => navigate(`/dashboard/teams/${params.row.id}`)}
          >
            View
          </Button>
        ) : null,
    },
  ];


  const combinedTeams = [...teamsWithPreferences, ...teamsWithoutPreferences];

  const teamsWithHasPreferences = combinedTeams.map((team) => ({
    ...team,
    hasPreferences: teamsWithPreferences.some((t) => t.id === team.id),
  }));

  console.log(membersImages);
  return isHOB ? (
    loading ? (
      <GridTableSkeleton mode={mode} />
    ) : teams && teams.length > 0 ? (
      <div
        style={{
          height: "100%",
          minHeight: 400,
          maxHeight: "calc(100vh - 100px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          className="head"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BreadCrumb items={[
              { label: "Home", href: "/" },
              { label: "Assignments", href: "/assignments" }
            ]} />
              {teamsWithoutPreferences.length === 0 &&
              Object.keys(assignment).length === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleMakeAssignment}
                >
                  Make assignment
                </Button>
              ) : null}

              {Object.keys(assignment).length !== 0 ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard/assignments/result")}
                >
                  View assignment
                </Button>
              ) : null}
        </div>
          <GridTable
            columns={columns}
            rows={teamsWithHasPreferences}
            loading={loading}
            mode={mode}
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
              snackbarMessage.includes("the assignment presses")
                ? "success"
                : "error"
            }
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <ConfirmationDialog
          openDialog={openDialog}
          message={"are you sure you want to make the assignment?"}
          handleConfirmClick={handleInitiateAssignment}
          setOpenDialog={setOpenDialog}
          setLoading={setAssignmentLoading}
          loading={assignmentLoading}
        />
      </div>
    ) : (
      <>
        <BreadCrumb items={[
              { label: "Home", href: "/" },
              { label: "Assignments", href: "/assignments" }
            ]} />
      <PlaceHolder
        icon={ErrorOutlineIcon}
        title="No Teams Found"
        message="There are no teams to assign to"
      />
      </>
    )
  ) : (
    <PlaceHolder
      icon={DoNotDisturbAltIcon}
      title="Access Denied"
      message="You do not have permission to view this page"
    />
  );
}

export default Assignments;
