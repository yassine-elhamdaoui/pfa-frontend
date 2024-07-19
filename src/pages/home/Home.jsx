import React from "react";
import {
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useTheme } from "@mui/material/styles";
import { hasRole } from "../../utils/userUtiles";

function Home() {
  const mode = localStorage.getItem("mode") || "light";
  const isStudent = hasRole("ROLE_STUDENT"); 
  const theme = useTheme();

  return (
    <Box
      style={{
        minHeight: "calc(100vh - 64px)",
        padding: "50px 20px",
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Welcome to PFA Management App
            </Typography>
            <Typography variant="h6" paragraph>
              Streamline your project management and collaboration with ease.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Place for an image */}
            <Box
              sx={{
                width: "100%",
                borderRadius: "8px",
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: "flex-end",

                },
              }}
            >
              <Box sx={{
                width: {
                  xs: "100%",
                  sm: "65%",
                },
              }}>
                <img
                  src="/src/assets/project-management.png"
                  alt="Home"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* Quick Links */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Quick Links
                </Typography>
                <Grid container spacing={2} sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <Grid item xs={6} md={3}>
                    <Button
                      component={RouterLink}
                      to={isStudent ? "/dashboard/project/team" : "/dashboard/projects"}
                      variant="outlined"
                      fullWidth
                      startIcon={<DashboardIcon />}
                    >
                      Dashboard
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Button
                      component={RouterLink}
                      to="/dashboard/projects"
                      variant="outlined"
                      fullWidth
                      startIcon={<AssignmentIcon />}
                    >
                      Projects
                    </Button>
                  </Grid>
                  {isStudent && (
                     <Grid item xs={6} md={3}>
                      <Button
                        component={RouterLink}
                        to="/dashboard/team"
                        variant="outlined"
                        fullWidth
                        startIcon={<GroupIcon />}
                      >
                        Team
                      </Button>
                    </Grid>
                    )}
                  <Grid item xs={6} md={3}>
                    <Button
                      component={RouterLink}
                      to="/dashboard/presentations"
                      variant="outlined"
                      fullWidth
                      startIcon={<CoPresentIcon />}
                    >
                      Presentations
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* About Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" paragraph>
                  Welcome to the PFA Management App, designed to streamline your
                  project management and collaboration efforts with intuitive
                  tools and features.
                </Typography>
                <Typography variant="body1" paragraph>
                  Our mission is to simplify the complexities of project
                  management, ensuring teams stay organized and productive. With
                  a user-friendly interface and powerful functionalities,
                  managing projects has never been easier.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Key Features:
                </Typography>
                <Typography variant="body1" paragraph>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DashboardIcon sx={{ mr: 1 }} />
                    Dashboard for quick overview and insights.
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AssignmentIcon sx={{ mr: 1 }} />
                    Project management tools to plan, track, and execute tasks
                    efficiently.
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    Team collaboration features to enhance teamwork and
                    communication.
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <NotificationsActiveIcon sx={{ mr: 1 }} />
                    Notifications and updates to keep everyone informed and
                    aligned.
                  </Box>
                </Typography>
                {/* YouTube Video Demo */}
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "56.25%", // 16:9 aspect ratio (for YouTube videos)
                    mt: 4,
                  }}
                >
                  <CardMedia
                    component="iframe"
                    src="https://www.youtube.com/embed/nGOy37YAE7g"
                    title="Demo Video"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
