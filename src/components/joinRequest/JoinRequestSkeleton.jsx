import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useMediaQuery } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const JoinRequestContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  margin: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("md")]: {
    width: "75%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "60%",
  },
}));

const UserInfoContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
});

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

function JoinRequestSkeleton() {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <JoinRequestContainer elevation={3}>
      <div style={{display:"flex",gap:"10px" , alignItems:"center" ,justifyContent:"space-between"}}>
        <UserInfoContainer>
          <Skeleton variant="circular" width={40} height={40} />
          <div>
            <Skeleton variant="text" width={130} />
            <Skeleton variant="text" width={200} />
          </div>
        </UserInfoContainer>
        <Skeleton variant="text" width={100} />
        {isSmallScreen ? (
          <Skeleton variant="rectangular" width={10} height={30} sx={{borderRadius:"5px"}} />
        ) : (
            <ButtonGroup>
              <Skeleton variant="rectangular" width={70} height={36} />
              <Skeleton variant="rectangular" width={70} height={36} />
            </ButtonGroup>
         ) }
      </div>
      <Skeleton variant="text" width="100%" />
    </JoinRequestContainer>
  );
}

export default JoinRequestSkeleton;
