import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
function TeamSkeleton() {
  const theme = useTheme();
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rectangular"
          width={200}
          height={25}
          sx={{ borderRadius: "30px" }}
        />
        <Skeleton
          variant="rectangular"
          width={80}
          height={40}
          sx={{ borderRadius: "5px" }}
        />
      </div>
      <Grid container spacing={1} marginTop={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Skeleton
            variant="rectangular"
            height={117}
            sx={{ borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Skeleton
            variant="rectangular"
            height={117}
            sx={{ borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Skeleton
            variant="rectangular"
            height={117}
            sx={{ borderRadius: "5px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Skeleton
            variant="rectangular"
            height={117}
            sx={{ borderRadius: "5px" }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: "25px", marginBottom: "25px" }} />
      <>
        <Skeleton
          variant="rectangular"
          height={25}
          width={100}
          sx={{ borderRadius: "30px" }}
        />

        <List
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <ListItem
            alignItems="flex-start"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              [theme.breakpoints.up("md")]: {
                width: "70%",
              },
            }}
          >
            <ListItemAvatar>
              <Skeleton
                variant="rectangular"
                height={45}
                width={45}
                sx={{ borderRadius: "50%" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="rectangular"
                  height={25}
                  width={120}
                  sx={{ borderRadius: "5px" }}
                />
              }
              secondary={
                <Skeleton
                  variant="rectangular"
                  height={50}
                  width="100%"
                  sx={{ borderRadius: "5px", marginTop: "8px" }}
                />
              }
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              [theme.breakpoints.up("md")]: {
                width: "70%",
              },
            }}
          >
            <ListItemAvatar>
              <Skeleton
                variant="rectangular"
                height={40}
                width={40}
                sx={{ borderRadius: "50%", marginTop: "20px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="rectangular"
                  height={25}
                  width={120}
                  sx={{ borderRadius: "5px" }}
                />
              }
              secondary={
                <Skeleton
                  variant="rectangular"
                  height={50}
                  width="100%"
                  sx={{ borderRadius: "5px", marginTop: "5px" }}
                />
              }
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              [theme.breakpoints.up("md")]: {
                width: "70%",
              },
            }}
          >
            <ListItemAvatar>
              <Skeleton
                variant="rectangular"
                height={40}
                width={40}
                sx={{ borderRadius: "50%", marginTop: "20px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="rectangular"
                  height={25}
                  width={120}
                  sx={{ borderRadius: "5px" }}
                />
              }
              secondary={
                <Skeleton
                  variant="rectangular"
                  height={50}
                  width="100%"
                  sx={{ borderRadius: "5px", marginTop: "5px" }}
                />
              }
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              [theme.breakpoints.up("md")]: {
                width: "70%",
              },
            }}
          >
            <ListItemAvatar>
              <Skeleton
                variant="rectangular"
                height={40}
                width={40}
                sx={{ borderRadius: "50%", marginTop: "20px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="rectangular"
                  height={25}
                  width={120}
                  sx={{ borderRadius: "5px" }}
                />
              }
              secondary={
                <Skeleton
                  variant="rectangular"
                  height={50}
                  width="100%"
                  sx={{ borderRadius: "5px", marginTop: "5px" }}
                />
              }
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              [theme.breakpoints.up("md")]: {
                width: "70%",
              },
            }}
          >
            <ListItemAvatar>
              <Skeleton
                variant="rectangular"
                height={40}
                width={40}
                sx={{ borderRadius: "50%", marginTop: "20px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="rectangular"
                  height={25}
                  width={120}
                  sx={{ borderRadius: "5px" }}
                />
              }
              secondary={
                <Skeleton
                  variant="rectangular"
                  height={50}
                  width="100%"
                  sx={{ borderRadius: "5px", marginTop: "5px" }}
                />
              }
            />
          </ListItem>
        </List>
      </>
    </div>
  );
}

export default TeamSkeleton;
