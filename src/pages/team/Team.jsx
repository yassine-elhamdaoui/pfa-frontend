import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";


function Team() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/project/team/${localStorage.getItem("team")}/makepreferences`)  };

  return (
    <div>
      Team
      <Button
        variant="outlined"
        onClick={handleNavigation }
      >
        make Preferences
      </Button>   
      
    </div>
  )
}

export default Team