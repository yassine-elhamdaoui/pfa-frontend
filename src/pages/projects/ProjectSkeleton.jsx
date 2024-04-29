import { Box, Card, Divider, Grid, Skeleton, Stack } from "@mui/material";

export default function ProjectSkeleton() {
    return (
        <>
          <Stack direction="row" spacing={2} marginTop={1} marginBottom={1} display="flex" justifyContent="space-between">
            <Skeleton variant="text" width={150} height={40} />
            <Skeleton variant="rectangular" width={40} height={40} sx={{borderRadius:"50%"}}/>
          </Stack>
        <Grid container spacing={2}>
          {[...Array(10)].map((_, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              gap={"10px"}
              key={index}
              sx={{ minWidth: "300px"}}
            >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "250px",
                alignItems: "stretch",
                gap: "10px",
                flexGrow: 1,
              }}
            >
              <Box sx={{ p: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Skeleton variant="text" width={150} height={40} />
                </Stack>
                <Divider />
                <Skeleton variant="text" width="100%" height={100} />
  
                <Stack direction="row" spacing={1} marginTop={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                </Stack>
              </Box>
              <Divider />
            </Card>
            </Grid>
          ))}
        </Grid>
        </>
      );
    
}