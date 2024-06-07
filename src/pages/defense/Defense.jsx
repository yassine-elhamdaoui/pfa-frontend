/* eslint-disable react/prop-types */
import {
  Agenda,
  Day,
  DragAndDrop,
  Inject,
  Month,
  ScheduleComponent,
  Week,
  WorkWeek,
  cellClick,
  popupClose,
} from "@syncfusion/ej2-react-schedule";
import { DropDownList, MultiSelect } from "@syncfusion/ej2-dropdowns";
import { createElement, useEffect, useState } from "react";
import { Button, Grid, Paper, TextField } from "@mui/material";

function Defense() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/presentations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(await response.json());
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.map(capitalizeFirstLetter));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleDragStop = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/presentations/" + data.Id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            startTime: data.StartTime,
            endTime: data.EndTime,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const capitalizeFirstLetter = (event) => {
    const capitalizedEvent = {};
    for (const key in event) {
      if (Object.hasOwnProperty.call(event, key)) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        capitalizedEvent[capitalizedKey] = event[key];
      }
    }
    return capitalizedEvent;
  };



const onPopupOpen = (args) => {
  if (args.type === "Editor") {
    const container = args.element.querySelector(".e-schedule-form");
    if (container) {
      // Remove unwanted elements if they exist
      const repeatRow = container.querySelector(
        ".e-float-input.e-control-wrapper.e-input-group.e-ddl.e-lib.e-keyboard.e-valid-input"
      );
      repeatRow && repeatRow.remove();
      const checkboxesRow = container.querySelector(".e-all-day-time-zone-row");
      checkboxesRow && (checkboxesRow.style.display = "none");
      const descriptionRow = container.querySelector(".e-description-row");
      descriptionRow && descriptionRow.remove();
      const titleRow = container.querySelector(".e-subject-container");
      titleRow && titleRow.remove();

      // Add custom fields for Team and Jury Members
      let teamField = container.querySelector(
        ".custom-team-field .e-dropdownlist"
      );
      if (!teamField) {
        teamField = document.createElement("div");
        teamField.className = "custom-team-field";
        teamField.innerHTML = `
          <label class="e-label">Team</label>
          <input class="e-field e-dropdownlist" name="Team" />
        `;
        container.appendChild(teamField);
        // Initialize DropDownList for Team field
        new DropDownList({
          dataSource: ["Option 1", "Option 2", "Option 3"], // Replace with your data
          placeholder: "Select Team",
          value: args.data.Team, // Set initial value
          change: (e) => {
            args.data.Team = e.value;
          },
        }).appendTo(teamField.querySelector("input"));
      }

      let juryMembersField = container.querySelector(
        ".custom-jury-field .e-multiselect"
      );
      if (!juryMembersField) {
        juryMembersField = document.createElement("div");
        juryMembersField.className = "custom-jury-field";
        juryMembersField.innerHTML = `
          <label class="e-label">Jury Members</label>
          <input class="e-field e-multiselect" name="JuryMembers" />
        `;
        container.appendChild(juryMembersField);
        // Initialize MultiSelect for Jury Members field
        new MultiSelect({
          dataSource: ["Option A", "Option B", "Option C"], // Replace with your data
          placeholder: "Select Jury Members",
          value: args.data.JuryMembers ? args.data.JuryMembers.split(",") : [], // Set initial value as an array
          change: (e) => {
            args.data.JuryMembers = e.value.join(",");
          },
        }).appendTo(juryMembersField.querySelector("input"));
      }
    }
  }
};



  return (
    <div className="defense">
      <ScheduleComponent
        eventSettings={{
          dataSource: events,
        }}
        allowDragAndDrop={true}
        height="calc(100vh - 100px)"
        // readonly={true}
        dragStop={(args) => {
          console.log("dragStop", args);
          const data = args.data;
          handleDragStop(data);
        }}
        actionComplete={(args) => {
          if (args.requestType === "eventCreated") {
            console.log("Event submitted:", args);
          }
        }}
        cellClick={(args) => {
          args.cancel = true;
        }}
        popupOpen={onPopupOpen}
      >
        
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  );
}

export default Defense;
