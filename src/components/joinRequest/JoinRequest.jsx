import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const JoinRequestContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  margin: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
}));

const UserInfoContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  flex: 1,
});

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

function JoinRequest() {
  return (
    <JoinRequestContainer elevation={3}>
      <div style={{width:"100%" , display:"flex" , alignItems:"center" ,gap:"10px"}}>
      <UserInfoContainer>
        <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
        <div>
          <Typography variant="h6">John Doe</Typography>
          <Typography variant="body1" color="textSecondary">
            john.doe@example.com
          </Typography>
        </div>
      </UserInfoContainer>
      <Typography variant="body2" color="textSecondary">
        Student
      </Typography>
      <ButtonGroup>
        <Button variant="outlined" color="primary" disableElevation>
          Accept
        </Button>
        <Button variant="outlined" color="error" disableElevation>
          Reject
        </Button>
      </ButtonGroup>

      </div>
      <Typography variant="body2" color="textSecondary">
        A new user has registered an account to the branch you're heading.
      </Typography>
    </JoinRequestContainer>
  );
}

export default JoinRequest;
