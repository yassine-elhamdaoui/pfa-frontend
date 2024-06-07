import { Grid, Paper, Skeleton } from "@mui/material";

function ProjectDetailsSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <Skeleton
        variant="rectangular"
        width={200}
        height={23}
        sx={{ borderRadius: "30px" }}
      />
      <Grid container spacing={2} style={{ flex: 1 }}>
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: "10px",
              display: "flex",
              gap: "10px",
              flexDirection: "column",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={70}
              sx={{ borderRadius: "5px" }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ borderRadius: "5px" }}
            />
          </Paper>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={87}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                width={50}
                sx={{ borderRadius: "5px" }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={165}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                sx={{ borderRadius: "5px" }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={246}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                width={190}
                sx={{ borderRadius: "5px" }}
              />
            </Paper>
          </div>

          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={100}
              height={23}
              sx={{ borderRadius: "30px" }}
            />
            <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
              <Skeleton
                variant="rectangular"
                height={55}
                sx={{ borderRadius: "5px 5px 0px 0px" }}
              />
              <Skeleton
                variant="rectangular"
                height={55}
              />
              <Skeleton
                variant="rectangular"
                height={55}
              />
              <Skeleton
                variant="rectangular"
                height={55}
                sx={{ borderRadius: "0px 0px 5px 5px" }}
              />
            </div>
          </div>

          {/* {hasRole("ROLE_SUPERVISOR") && (
            <Button
              sx={{ position: "fixed", bottom: 16, right: 16 }}
              component={Link}
              to={/edit-project/${id}}
              variant="contained"
              color="primary"
            >
              Edit Project Details <BorderColorOutlinedIcon />
            </Button>
          )} */}
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            elevation={0}
            sx={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              height: "100%",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={100}
              sx={{ borderRadius: "30px" }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              width="100"
              sx={{ borderRadius: "5px" }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              width="100"
              sx={{ borderRadius: "5px" }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              width="100"
              sx={{ borderRadius: "5px" }}
            />
            <Skeleton
              variant="rectangular"
              width={70}
              sx={{ borderRadius: "30px" }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              width="100"
              sx={{ borderRadius: "5px" }}
            />
            <>
              <Skeleton
                variant="rectangular"
                width={100}
                sx={{ borderRadius: "30px" }}
              />
              <Skeleton
                variant="rectangular"
                height={120}
                width="100"
                sx={{ borderRadius: "5px" }}
              />
            </>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProjectDetailsSkeleton