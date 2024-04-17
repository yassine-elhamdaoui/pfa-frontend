import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const PlaceHolder = ({ icon: Icon, title, message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20vh",
      }}
    >
      <Icon sx={{ fontSize: 100, color: "red" }} />
      <Typography variant="h4" gutterBottom align="center">
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center">
        {message}
      </Typography>
    </Box>
  );
};

PlaceHolder.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default PlaceHolder;
