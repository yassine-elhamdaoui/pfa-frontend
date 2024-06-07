import { Typography, Container, Grid, Box } from "@mui/material";

function Home() {
  return (
    <Box style={{ minHeight: "calc(100vh - 64px)", padding: "20px" }}>
      {/* Hero Section */}
      <Container>
        <Box
          container
          spacing={4}
          alignItems="center"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Text on the Left */}
          <Box item xs={12} sm={6}>
            <Typography variant="h3" gutterBottom>
              Welcome to My Website
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              vitae velit nec odio sollicitudin convallis. Integer eu mi ac
              turpis dapibus laoreet at nec nulla.
            </Typography>
          </Box>
          {/* Image on the Right */}
          <Box item xs={12} sm={6}>
            <img
              src="/src/assets/project-management.png"
              alt="Hero Image"
              height={400}
            />
          </Box>
        </Box>
      </Container>

      {/* About Section */}
      <Container>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae
          velit nec odio sollicitudin convallis. Integer eu mi ac turpis dapibus
          laoreet at nec nulla. Fusce sit amet mauris id felis congue sodales ut
          nec sapien. Sed auctor nulla in ante euismod, sed consectetur leo
          sagittis. In hac habitasse platea dictumst.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
