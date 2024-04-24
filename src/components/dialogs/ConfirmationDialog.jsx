/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoadingButton } from "@mui/lab";



export default function ConfirmationDialog({
  message,
  openDialog,
  setOpenDialog,
  handleConfirmClick,
  setLoading,
  loading,
}) {
  const onConfirmDialogClose = () => {
    setOpenDialog(false);
  };
  const onConfirmDialogConfirm = () => {
    setLoading(true);
    handleConfirmClick();
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
          variant="contained"
          onClick={onConfirmDialogConfirm}
          autoFocus
        >
          <span>Confirm</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
