/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Day,
  DragAndDrop,
  Inject,
  Month,
  ScheduleComponent,
  Week,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { DropDownList, MultiSelect } from "@syncfusion/ej2-dropdowns";
import {  useEffect, useRef, useState } from "react";
import { getSupervisors } from "../../services/userService";
import { getAllTeams } from "../../services/teamService";
import { addPresentationsPlan, createPresentation, deletePresentation, getAllPresentations, getPresentationsPlan, updatePresentation, updatePresentationOnDrag, validatePresentationsPlan } from "../../services/presentaionService";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import "./defense.scss";
import { Button, Typography } from "@mui/material";
import { hasRole } from "../../utils/userUtiles";
import DefenseSkeleton from "./DefenseSkeleton";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";

const token = localStorage.getItem("token");
function Defense() {
  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  const isStudent = hasRole("ROLE_STUDENT");
  const mode = localStorage.getItem("mode")
  const [events, setEvents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading,setLoading] = useState(false); 
  const [render , setRender] = useState(false);


  const [confirmationOpenDialog, setConfirmationOpenDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const initialRender = useRef(true);

  const [presentationsPlan, setPresentationsPlan] = useState({});
  useEffect(() => {
    const fetchEvents = async () => {
      if (initialRender.current) {
        setLoading(true);
      }
      try {
        const fetchedSupervisors = await getSupervisors(token);
        const fetchedTeams = await getAllTeams(token);
        const teamsWithNoPresentation = fetchedTeams.filter(
          (team) => team.presentation === null
        );
        console.log(teamsWithNoPresentation);
        const fetchedPresentations = await getAllPresentations(token);
        console.log(supervisors);
        setSupervisors(fetchedSupervisors);
        setTeams(teamsWithNoPresentation);
        setEvents(fetchedPresentations);
        const fetchedPresentationsPlan = await getPresentationsPlan(token);
        console.log(fetchedPresentationsPlan);
        setPresentationsPlan(fetchedPresentationsPlan);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      }finally{
        if (!initialRender.current) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    initialRender.current = false; 

  }, [render]);
  const handleDragStop = async (data) => {
    const updatedEvent = await updatePresentationOnDrag(token, data);
  };
  const handleCreatePresentation = async (data) => {
    const createdEvent = await createPresentation(token, data,setRender);
  };
  const handleEditPresentation = async (data) => {
    const updatedEvent = await updatePresentation(token, data,setRender);
  };
  const handleDeletePresentation = async (data) => {
    const response = await deletePresentation(token, data,setRender);
  };




    const onPopupOpen = (args) => {
      if (args.type === "Editor") {
        mode === "dark" ? args.element.classList.add("custom-popup") : args.element.classList.remove("custom-popup");

        const container = args.element.querySelector(".e-schedule-form");
        if (container) {
          // Remove unwanted elements if they exist
          const repeatRow = container.querySelector(
            ".e-float-input.e-control-wrapper.e-input-group.e-ddl.e-lib.e-keyboard.e-valid-input"
          );
          repeatRow && (repeatRow.style.display = "none");
          const checkboxesRow = container.querySelector(".e-all-day-time-zone-row");
          checkboxesRow && (checkboxesRow.style.display = "none");
          const descriptionRow = container.querySelector(".e-description-row");
          descriptionRow && descriptionRow.remove();
          const titleRow = container.querySelector(".e-subject-container");
          titleRow && titleRow.remove();
          const locationContainer = container.querySelector(
            ".e-location-container"
          );
          if (locationContainer) {
            locationContainer.style.width = "100%";
            locationContainer.style.padding = "0";
          }

          // Add custom fields for Team and Jury Members
          let teamField = container.querySelector(
            ".custom-team-field .e-dropdownlist"
          );
          if (!teamField) {
            teamField = document.createElement("div");
            teamField.className = "custom-team-field";
            teamField.innerHTML = `
              <label class="e-label">Team</label>
              <input class="e-field e-dropdownlist" name="Subject" />
              <input type="hidden" class="e-field" name="TeamId" />
            `;
            container.appendChild(teamField);
            // Initialize DropDownList for Team field
            console.log(teams);
            new DropDownList({
              cssClass: mode === "dark" ? "custom-dropdown" : "",
              dataSource: teams.map((team) => team.name), // Replace with your data
              placeholder: "Select Team",
              value: args.data.Team, // Set initial value
              change: (e) => {
                if (!e.value) {
                  args.data.Team = "";
                  args.data.TeamId = "";
                  teamField.querySelector(
                    'input[name="TeamId"]'
                  ).value = "";
                }else{
                  const selectedTeam = teams.filter(
                    (team) =>
                      e.value.includes(
                        `${team.name}`
                      )
                  );
                  const selectedTeamId = selectedTeam.map(
                    (team) => team.id
                  );
                  teamField.querySelector(
                    'input[name="TeamId"]'
                  ).value = selectedTeamId;
                    args.data.TeamId = e.value;
                  }

                }
            }).appendTo(teamField.querySelector("input"));
          }

          let juryMembersField = container.querySelector(
            ".custom-jury-field .e-multiselect"
          );
          if (!juryMembersField) {
            juryMembersField = document.createElement("div");
            juryMembersField.className = "custom-jury-field";
            juryMembersField.style.marginTop = "10px";
            juryMembersField.innerHTML = `
              <label class="e-label">Jury Members</label>
              <input class="e-field e-multiselect" name="JuryMembers" />
              <input type="hidden" class="e-field" name="JuryMemberIds" />
              <input type="hidden" class="e-field" name="Description" />
            `;
            container.appendChild(juryMembersField);
            // Initialize MultiSelect for Jury Members field
            console.log(supervisors);
            console.log(
              supervisors.map(
                (supervisor) => `${supervisor.firstName} ${supervisor.lastName}`
              )
            );
            console.log(args.data.JuryMembers);
            const multiSelectInstance = new MultiSelect({
              cssClass: mode === "dark" ? "custom-dropdown" : "",
              dataSource: supervisors.map(
                (supervisor) => `${supervisor.firstName} ${supervisor.lastName}`
              ), // Replace with your data
              placeholder: "Select Jury Members",
              value: Array.isArray(args.data.JuryMembers)
                ? args.data.JuryMembers.map((member) =>
                    typeof member === "string"
                      ? member
                      : `${member.firstName} ${member.lastName}`
                  )
                : [], // Set initial value as an array
              change: (e) => {
                if (e.value) {
                  // Check if e.value is not null
                  args.data.JuryMembers = e.value.join(",");
                  const selectedSupervisors = supervisors.filter((supervisor) =>
                    e.value.includes(`${supervisor.firstName} ${supervisor.lastName}`)
                  );
                  const selectedIds = selectedSupervisors.map(
                    (supervisor) => supervisor.id
                  );
                  juryMembersField.querySelector('input[name="JuryMemberIds"]').value =
                    selectedIds.join(",");
                  juryMembersField.querySelector(
                    'input[name="Description"]'
                  ).value = `Jury Members: ${e.value.join(", ")}`;
                  args.data.JuryMemberIds = selectedIds.join(",");
                  args.data.Description = `Jury Members: ${e.value.join(", ")}`;
                } else {
                  args.data.JuryMembers = "";
                  juryMembersField.querySelector('input[name="JuryMemberIds"]').value = "";
                  args.data.JuryMemberIds = "";
                  args.data.Description = "";
                }
              },
            }).appendTo(juryMembersField.querySelector("input.e-multiselect"));

          }
        }
      }
      if (args.type === "DeleteAlert") {
        mode === "dark"
          ? args.element.classList.add("custom-delete-popup")
          : args.element.classList.remove("custom-delete-popup");
      }
    };

console.log(presentationsPlan);
  if (loading) {
    return <DefenseSkeleton />;
  }

  if (presentationsPlan && Object.keys(presentationsPlan).length > 0) {
    if (presentationsPlan.completed) {      
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            className={mode === "dark" ? "schedule-component" : ""}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BreadCrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "dashboard", path: "" },
                  { label: "Presentations", path: "" },
                ]}
              />
              
            </div>
            <ScheduleComponent
              eventSettings={{
                dataSource: events,
              }}
              allowDragAndDrop={true}
              height="calc(100vh - 140px)"
              style={{ borderRadius: "5px" }}
              readonly={isStudent || isSupervisor ? true : false}
              dragStop={(args) => {
                console.log("dragStop", args);
                const data = args.data;
                handleDragStop(data);
              }}
              actionComplete={(args) => {
                console.log(args);
                if (args.requestType === "eventCreated") {
                  handleCreatePresentation(args.data);
                }
                if (args.requestType === "eventRemoved") {
                  handleDeletePresentation(args.data);
                }
                if (args.requestType === "eventChanged") {
                  handleEditPresentation(args.data);
                }
              }}
              cellClick={(args) => {
                args.cancel = true;
              }}
              popupOpen={onPopupOpen}
              // popupClose={onPopupClose}
              // editorTemplate={editorTemplate}
            >
              <Inject services={[Day, Week, WorkWeek, Month, DragAndDrop]} />
            </ScheduleComponent>
          </div>
        );
    }else{
      if (isStudent) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BreadCrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "dashboard", path: "" },
                  { label: "Presentations", path: "" },
                ]}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "100px",
                alignItems: "center",
              }}
            >
              <img src="/src/assets/scheduler.png" height={200} width={200} />
              <Typography variant="h5" color="textSecondary" textAlign="center">
                No presentations to show
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
              >
                Ooops! please wait until the head of branch validate the
                presentations
              </Typography>
            </div>
          </div>
        );
      }else{
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            className={mode === "dark" ? "schedule-component" : ""}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BreadCrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "dashboard", path: "" },
                  { label: "Presentations", path: "" },
                ]}
              />
              {isHOB && presentationsPlan &&
              Object.keys(presentationsPlan).length > 0 &&
              presentationsPlan.completed ? (
                <></>
              ) : (
                <Button onClick={() => setConfirmationOpenDialog(true)}>
                  validate plan
                </Button>
              )}
            </div>
            <ScheduleComponent
              eventSettings={{
                dataSource: events,
              }}
              allowDragAndDrop={true}
              height="calc(100vh - 140px)"
              style={{ borderRadius: "5px" }}
              readonly={isStudent || isSupervisor? true : false}
              dragStop={(args) => {
                console.log("dragStop", args);
                const data = args.data;
                handleDragStop(data);
              }}
              actionComplete={(args) => {
                console.log(args);
                if (args.requestType === "eventCreated") {
                  handleCreatePresentation(args.data);
                }
                if (args.requestType === "eventRemoved") {
                  handleDeletePresentation(args.data);
                }
                if (args.requestType === "eventChanged") {
                  handleEditPresentation(args.data);
                }
              }}
              cellClick={(args) => {
                args.cancel = true;
              }}
              popupOpen={onPopupOpen}
              // popupClose={onPopupClose}
              // editorTemplate={editorTemplate}
            >
              <Inject services={[Day, Week, WorkWeek, Month, DragAndDrop]} />
            </ScheduleComponent>
            <ConfirmationDialog
              message={"Are you sure you want to validate presentations plan?"}
              openDialog={confirmationOpenDialog}
              setOpenDialog={setConfirmationOpenDialog}
              handleConfirmClick={() => validatePresentationsPlan(token)}
              setLoading={setConfirmLoading}
              loading={confirmLoading}
              setRender={setRender}
            />
          </div>
        );
      }
    }
  }else{
    if (isStudent || isSupervisor) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BreadCrumb
              items={[
                { label: "Home", path: "/" },
                { label: "dashboard", path: "" },
                { label: "Presentations", path: "" },
              ]}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "100px",
              alignItems: "center",
            }}
          >
            <img src="/src/assets/scheduler.png" height={200} width={200} />
            <Typography variant="h5" color="textSecondary" textAlign="center">
              No presentations to show
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              Ooops! please wait until the head of branch validate the
              presentations
            </Typography>
          </div>
        </div>
      );
    }else if(isHOB){
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BreadCrumb
              items={[
                { label: "Home", path: "/" },
                { label: "dashboard", path: "" },
                { label: "Presentations", path: "" },
              ]}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "100px",
              alignItems: "center",
            }}
          >
            <img src="/src/assets/scheduler.png" height={200} width={200} />
            <Typography variant="h5" color="textSecondary" textAlign="center">
              No presentations to show
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              There is still no presentations plan for this year, go ahead and{" "}
              <span
                onClick={() => addPresentationsPlan(token,setRender,initialRender)}
                style={{ color: "#1976d2", fontWeight: "bold",cursor:"pointer" }}
              >
                create
              </span>{" "}
              one.
            </Typography>
          </div>
        </div>
      );
    }
  }
}

export default Defense;
