/* eslint-disable react/prop-types */
import { DeleteOutline } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  Box,
  IconButton,
  Popover,
  Tab,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { stringAvatar } from "../../utils/generalUtils";
import "./notifications.scss";
import { has } from "lodash";
import { hasRole } from "../../utils/userUtiles";

function Notifications({
  isNotificationPopoverOpen,
  notificationAnchorEl,
  handleCloseNotsView,
  notifications,
  handleDeleteNotification,
  elapsedTime,
  mode,
  teamNotifications,
  sendersImages
}) {
  const [value, setValue] = useState("1");
  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isStudent =  hasRole("ROLE_STUDENT")
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH")
  
console.log(sendersImages);
  const handleNotsViewChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Popover
      open={isNotificationPopoverOpen}
      anchorEl={notificationAnchorEl}
      onClose={handleCloseNotsView}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPopover-paper": {
          borderRadius: "15px",
          width: window.innerWidth > 550 ? "380px" : "100svw",
          height: window.innerWidth > 550 ? "65svh" : "100svh",
          minHeight: "65svh",
          backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
          position: "relative",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          borderRadius: "15px 15px 0 0 ",
          padding: "15px",
          display: "flex",
          width: window.innerWidth > 550 ? "380px" : "calc(100svw - 32px)",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          zIndex: "1",
          backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
        }}
      >
        <Typography>Notifications</Typography>
        <IconButton onClick={handleCloseNotsView}>
          <CloseIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          paddingTop: "54px",
          backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleNotsViewChange}
              aria-label="lab API tabs example"
              sx={{
                position: "fixed",
                width: window.innerWidth > 550 ? "380px" : "calc(100% - 32px)",
                backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
                zIndex: "1",
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
              }}
            >
              <Tab label="General" value="1" />
              {isStudent && <Tab label="Team" value="2" />}
              {(isSupervisor || isStudent) && <Tab label="Project" value="3" />}
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: "48px 0 0 0" }}>
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    display: "flex",
                    padding: "8px",
                    alignItems: "center",
                    borderBottom: `1px solid ${
                      mode === "dark" ? "#e0e0e070" : "#e0e0e0"
                    }`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      width: "100%",
                      alignItems: "start",
                      minHeight: "70px",
                    }}
                  >
                    <div style={{ margin: "10px 0 0 0" }}>
                      {console.log(notification.idOfSender)}
                      <Avatar
                        variant="square"
                        src={
                          sendersImages.find(
                            (sender) => sender.id === notification.idOfSender
                          )?.url
                        }
                        height={35}
                        width={35}
                        sx={{ borderRadius: "10px" }}
                      />
                    </div>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        Height: "inherit",
                        minHeight: "inherit",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: "13px" }}
                      >
                        {notification.description}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{
                          textAlign: "end",
                          fontSize: "10px",
                        }}
                      >
                        {elapsedTime[notification.id]}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Box>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "50px",
                }}
              >
                <img
                  src="/src/assets/notification.png"
                  height={150}
                  width={150}
                />
                <Typography
                  variant="body1"
                  color="textSecondary"
                  alignText="center"
                >
                  No notifications to show
                </Typography>
              </div>
            )}
          </TabPanel>
          {isStudent && (
            <TabPanel value="2" sx={{ padding: "48px 0 0 0" }}>
              {teamNotifications && teamNotifications.length > 0 ? (
                teamNotifications.map((teamNotification) => (
                  <Box
                    key={teamNotification.id}
                    sx={{
                      display: "flex",
                      padding: "8px",
                      alignItems: "center",
                      borderBottom: `1px solid ${
                        mode === "dark" ? "#e0e0e070" : "#e0e0e0"
                      }`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        width: "100%",
                        alignItems: "start",
                        minHeight: "70px",
                      }}
                    >
                      <div style={{ margin: "10px 0 0 0" }}>
                        <Avatar
                          variant="square"
                          src={
                            sendersImages.find(
                              (sender) =>
                                sender.id === teamNotification.idOfSender
                            )?.url
                          }
                          height={35}
                          width={35}
                          sx={{ borderRadius: "10px" }}
                        />
                      </div>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: "100%",
                          Height: "inherit",
                          minHeight: "inherit",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontSize: "13px" }}
                        >
                          {teamNotification.description}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          sx={{
                            textAlign: "end",
                            fontSize: "10px",
                          }}
                        >
                          {elapsedTime[teamNotification.id]}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() =>
                        handleDeleteNotification(
                          teamNotification.id,
                          teamNotification.type
                        )
                      }
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "50px",
                  }}
                >
                  <img
                    src="/src/assets/notification.png"
                    height={150}
                    width={150}
                  />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    alignText="center"
                  >
                    No team notifications to show
                  </Typography>
                </div>
              )}
            </TabPanel>
          )}
          {(isStudent || isSupervisor) && (
            <TabPanel value="3" sx={{ padding: "48px 0 0 0" }}>
              {teamNotifications && teamNotifications.length > 0 ? (
                teamNotifications.map((teamNotification) => (
                  <Box
                    key={teamNotification.id}
                    sx={{
                      display: "flex",
                      padding: "8px",
                      alignItems: "center",
                      borderBottom: `1px solid ${
                        mode === "dark" ? "#e0e0e070" : "#e0e0e0"
                      }`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        width: "100%",
                        alignItems: "start",
                        minHeight: "70px",
                      }}
                    >
                      <div style={{ margin: "10px 0 0 0" }}>
                        <Avatar
                          variant="square"
                          src={
                            sendersImages.find(
                              (sender) =>
                                sender.id === teamNotification.idOfSender
                            )?.url
                          }
                          height={35}
                          width={35}
                          sx={{ borderRadius: "10px" }}
                        />
                      </div>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: "100%",
                          Height: "inherit",
                          minHeight: "inherit",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontSize: "13px" }}
                        >
                          {teamNotification.description}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          sx={{
                            textAlign: "end",
                            fontSize: "10px",
                          }}
                        >
                          {elapsedTime[teamNotification.id]}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() =>
                        handleDeleteNotification(
                          teamNotification.id,
                          teamNotification.type
                        )
                      }
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "50px",
                  }}
                >
                  <img
                    src="/src/assets/notification.png"
                    height={150}
                    width={150}
                  />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    alignText="center"
                  >
                    No project notifications to show
                  </Typography>
                </div>
              )}
            </TabPanel>
          )}
          {isSupervisor}
        </TabContext>
      </Box>
    </Popover>
  );
}

export default Notifications;
