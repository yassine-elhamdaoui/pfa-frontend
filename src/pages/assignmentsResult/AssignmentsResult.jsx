import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import GridTable from "../../components/gridTable/GridTable";
import GridTableSkeleton from "../../components/gridTable/GridTableSkeleton";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import {
  getAllPreferences,
  getAllProjectsForCurrentYear,
  getAssignment,
  validateAssignments,
} from "../../services/projectService";
import { getAllTeams } from "../../services/teamService";
import { hasRole } from "../../utils/userUtiles";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import { Button, Typography } from "@mui/material";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import EditAssignmentDialog from "../../components/dialogs/EditAssignmentDialog";
import { set } from "lodash";
import { Link } from "react-router-dom";

const token = localStorage.getItem("token");
const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");

// eslint-disable-next-line react/prop-types
function AssignmentsResult({ mode }) {
    const [openDialog, setOpenDialog] = useState(false);
    const handleMakeAssignment = () => {
      setOpenDialog(true);
    };

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [assignmentsResult, setAssignmentsResult] = useState([]);
  const [originalAssignmentsResult, setOriginalAssignmentsResult] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  function handleAssignClick() {
      validateAssignments(
      token,
      setSnackbarOpen,
      setSnackbarMessage,
      setAssignmentLoading
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let academicYear 
          const year = new Date().getFullYear();
          const month = new Date().getMonth();
          if (month >= 9 && month <= 12) {
            academicYear = `${year}/${year + 1}`;
          } else if (month >= 1 && month <= 7) {
            academicYear = `${year - 1}/${year}`;
          }
        const fetchedTeams = await getAllTeams(token,academicYear);
        const fetchedProjects = await getAllProjectsForCurrentYear(token);
        const fetchedAssignmentsResult = await getAllPreferences(token);
        const fetchedAssignment = await getAssignment(token);
        console.log(fetchedAssignment);
        console.log(fetchedProjects);
        console.log(fetchedTeams);
        console.log(fetchedAssignmentsResult);

        const processedAssignmentsResult = fetchedAssignmentsResult.map(
          (assignment) => {
            const assignedProjects = Object.keys(
              assignment.projectPreferenceRanks
            ).map((projectId) => parseInt(projectId));
            return { teamId: assignment.user.teamId, assignedProjects };
          }
        );
        setTeams(fetchedTeams);
        setProjects(fetchedProjects);
        setAssignmentsResult(processedAssignmentsResult);
        setOriginalAssignmentsResult(fetchedAssignmentsResult);
        setAssignment(fetchedAssignment);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching projects, teams, and assignments result:",
          error
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentLoading]);

  const columns = [
    {
      field: "team",
      headerName: "Team",
      headerClassName: "custom-header",
      width: 110,
    },
    ...projects.map((project) => ({
      field: `${project.title}`,
      headerStyle: { backgroundColor: "lightgray" },
      headerClassName: "custom-header",
      headerName: project.name,
      width: 110,
      renderCell: (params) => {
        const isAssigned = assignmentsResult.some(
          (assignment) =>
            assignment.teamId === params.row.id &&
            assignment.assignedProjects.includes(project.id)
        );

        return (
          <div
            style={{
              backgroundColor: isAssigned ? "green" : "null",
              width: "100%",
              height: "100%",
            }}
          ></div>
        );
      },
    })),
  ];

  const rows = teams.map((team) => ({
    id: team.id,
    team: team.name,
    ...projects.reduce((acc, project) => {
      acc[`project_${project.id}`] = ""; // Initialize cell value
      return acc;
    }, {}),
  }));
  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  return loading ? (
    <GridTableSkeleton mode={mode} />
  ) : (Object.keys(assignment).length !== 0 &&
      assignment.completed === false &&
      isHOB) ||
    assignment.completed === true ? (
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
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Assignments", href: "/assignments" },
            { label: "Result", href: "/result" },
          ]}
        />
        {assignment && assignment.completed === false && isHOB ? (
          <div style={{display:"flex" , justifyContent:"center"}}>
            <Button variant="text" onClick={handleEditDialogOpen}>
              Edit
            </Button>
            <Button variant="outlined" onClick={handleMakeAssignment}>
              Validate
            </Button>
          </div>
        ) : null}
      </div>
      <GridTable columns={columns} rows={rows} loading={loading} mode={mode} />
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
            (snackbarMessage.includes("projects are now") ||
              snackbarMessage.includes("successfully"))
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
        message={
          "are you sure you want to validate the assignment? .The projects will be assigned to the teams permanently."
        }
        handleConfirmClick={handleAssignClick}
        setOpenDialog={setOpenDialog}
        setLoading={setAssignmentLoading}
        loading={assignmentLoading}
      />
      {console.log(assignmentsResult)}
      <EditAssignmentDialog
        teams={teams}
        projects={projects}
        originalAssignmentsResult={originalAssignmentsResult}
        editDialogOpen={openEditDialog}
        handleDialogClose={handleDialogClose}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarOpen={setSnackbarOpen}
      />
    </div>
  ) : (
    <>
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Assignments", href: "/assignments" },
          { label: "Result", href: "/result" },
        ]}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "100px",
          alignItems: "center",
        }}
      >
        <img src="/src/assets/teams_assignemt.png" height={180} width={180} style={{marginBottom:"10px"}}/>
        <Typography variant="h5" color="textSecondary" textAlign="center">
          There are no assignments to show
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center">
          Please wait for the assignments to be generated
        </Typography>
      </div>
    </>
  );
}

export default AssignmentsResult;
