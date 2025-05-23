/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";
import { set } from "lodash";



export default function ConfirmationDialog({
  id,
  message,
  openDialog,
  setOpenDialog,
  handleConfirmClick,
  setLoading,
  loading,
  setRender,
}) {
 
  const onConfirmDialogClose = () => {
    setLoading(false);
    setOpenDialog(false);
  };
  const onConfirmDialogConfirm = (id) => {
    setLoading(true);
    if (id==null) {
      if (setRender) {
        setRender((prev) => !prev);
      }
    handleConfirmClick();
    } else {
      handleConfirmClick(id)
    }
   
    setOpenDialog(false);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={onConfirmDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirmDialogClose} color="error">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          sx={{marginLeft:"15px" , marginRight:"15px"}}
          loadingIndicator="Loading..."
          variant="outlined"
          onClick={()=>onConfirmDialogConfirm(id)}
          autoFocus
        >
          <span>Confirm</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
