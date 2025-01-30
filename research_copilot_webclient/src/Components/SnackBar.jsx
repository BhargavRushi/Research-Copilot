import * as React from 'react';
import {Alert} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

export default function SimpleSnackbar(props) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setOpenSnackBar(false);
  };

  return (
    <div>
      <Snackbar
        open={props.openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={props.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      ><Alert onClose={handleClose} severity={props.severity}>{props.message}</Alert></Snackbar>
    </div>
  );
}
