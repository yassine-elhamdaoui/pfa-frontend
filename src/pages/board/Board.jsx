import { useState } from "react";
import "./board.scss";

import {
  ColumnDirective,
  ColumnsDirective,
  KanbanComponent,
} from "@syncfusion/ej2-react-kanban";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/navBar/navBar";
import SearchIcon from "@mui/icons-material/Search";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { stringAvatar } from "../../utils/generalUtils";


function Board() {
  const mode = localStorage.getItem("mode");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

      const handleCardDoubleClick = (args) => {
        setSelectedCard(args.data); // Store the selected card data
        setOpenDialog(true); // Open the dialog
      };

      const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog
      };
  const updateStoryStatus = (storyId, newStatus) => {
    console.log(`Updating story ${storyId} to status ${newStatus}`);
  };

  const kanbanDataSource = [
    {
      ID: 1,
      Title: "Story 1",
      Summary: "hhhhhhhhhhh",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Yassine El Hamdaoui",
      Status: "Open",
      Tags: ["Story", "Low"],
    },
    {
      ID: 2,
      Title: "Story 2",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Yassine El Hamdaoui",
      Status: "Open",
      Tags: ["Story", "Low"],
    },
    {
      ID: 3,
      Title: "Story 3",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Yassine El Hamdaoui",
      Status: "In Progress",
      Tags: ["Story", "Low"],
    },
    {
      ID: 4,
      Title: "Story 4",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Yassine El Hamdaoui",
      Status: "In Progress",
      Tags: ["Story", "Low"],
    },
    {
      ID: 5,
      Title: "Story 5",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Rahma El Atrach",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 6,
      Title: "Story 6",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Rahma El Atrach",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 7,
      Title: "Story 7",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Rahma El Atrach",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 8,
      Title: "Story 8",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Rahma El Atrach",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 9,
      Title: "Story 9",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Rahma El Atrach",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 10,
      Title: "Story 10",
      Summary:
        "This is a story This is a story This is a sto This is a story This is a storyry This is a story This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Ayoub El Yaakoubi",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 11,
      Title: "Story 11",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Ayoub El Yaakoubi",
      Status: "Open",
      Tags: ["Story", "Low"],
    },
    {
      ID: 12,
      Title: "Story 12",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Ayoub El Yaakoubi",
      Status: "In Progress",
      Tags: ["Story", "Low"],
    },
    {
      ID: 13,
      Title: "Story 13",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Ayoub El Yaakoubi",
      Status: "In Progress",
      Tags: ["Story", "Low"],
    },
    {
      ID: 14,
      Title: "Story 14",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Chaimae Rachdi",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
    {
      ID: 15,
      Title: "Story 15",
      Summary: "This is a story",
      Type: "Story",
      Priority: "Low",
      storyPoints: 3,
      Assignee: "Chaimae Rachdi",
      Status: "Done",
      Tags: ["Story", "Low"],
    },
  ];

  const swimlaneTemplate = (data) => {
    if (data && data.keyField !== "") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px",
          }}
        >
          <Avatar {...stringAvatar(data.keyField, 30, 15)} />
          <span>{data.keyField}</span>
          <Typography variant="body3" color="textSecondary">
            {data.count} items
          </Typography>
        </div>
      );
    }
    return null;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredDataSource = kanbanDataSource.filter(
    (item) =>
      item.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Summary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={mode === "dark" ? "dark-theme-kanban" : "light-theme-kanban"}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <BreadCrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Board", url: "/board" },
        ]}
      />
      <Box
        sx={{
          width: "fit-content",
          marginLeft: window.innerWidth > 600 ? "-15px" : "0",
        }}
      >
        <Search
          sx={{
            margin: 0,
            backgroundColor: mode === "dark" ? "#333" : "#f5f5f5",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#33333390" : "#33333320",
            },
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for a story..."
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchChange}
          />
        </Search>
      </Box>
      <KanbanComponent
        allowSearch={true}
        className="kanban-container"
        dataSource={filteredDataSource}
        keyField="Status"
        dialogOpen={false}
        cardSettings={{
          contentField: "Summary",
          headerField: "Title",
          grabberField: "Assignee",
          tagsField: "Tags",
        }}
        cardDoubleClick={handleCardDoubleClick}
        cardRendered={(args) => {
          const { data } = args;
          const { Assignee } = data;
          const avatarColor = stringAvatar(Assignee).sx.bgcolor;
          const lightColor = avatarColor.concat("90");
          args.element.style.borderLeft = `5px solid ${lightColor}`;
        }}
        dragStop={(args) => {
          const { data } = args;
          if (data[0].Assignee !== "Yassine El Hamdaoui") {
            args.cancel = true;
          }
          console.log(args);
          const storyId = data[0].ID;
          const newStatus = data[0].Status;
          updateStoryStatus(storyId, newStatus);
        }}
        swimlaneSettings={{
          template: swimlaneTemplate,
          keyField: "Assignee",
          showItemCount: false,
        }}
        enableTooltip={openDialog ? false : true}
        height="100%"
      >
        <ColumnsDirective>
          <ColumnDirective
            allowToggle={true}
            keyField="Open"
            headerText="Open"
          ></ColumnDirective>
          <ColumnDirective
            allowToggle={true}
            keyField="In Progress"
            headerText="In Progress"
          ></ColumnDirective>
          <ColumnDirective
            allowToggle={true}
            keyField="Done"
            headerText="Done"
          ></ColumnDirective>
        </ColumnsDirective>
      </KanbanComponent>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCard?.Title}</DialogTitle>
        <DialogContent>
          <div>{selectedCard?.Summary}</div>
          {/* Add more details here as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Board;
