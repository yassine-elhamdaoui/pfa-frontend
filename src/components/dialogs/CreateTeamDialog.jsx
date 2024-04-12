import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import {
  Button,
  TextField
} from "@mui/material";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
// eslint-disable-next-line react/prop-types
function CreateTeamDialog({ teamDialogOpen, handleModalClose }) {
  return (
    <Dialog
      open={teamDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleModalClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleModalClose();
        },
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Create Team"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          illo ullam dolorum iusto, architecto dolore aliquam officiis sunt
          voluptatum ducimus mollitia vel eaque minus. Temporibus nemo esse
          dolor libero eos?
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTeamDialog;
