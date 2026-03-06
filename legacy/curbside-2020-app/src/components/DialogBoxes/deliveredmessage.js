import React, { useEffect } from "react";
import {Dialog, DialogTitle, DialogContent, Button, DialogActions, Snackbar} from "@material-ui/core"
import {useSnackbar} from 'notistack';
import Alert from '@material-ui/lab/Alert';
import {AppContext} from "../../utils/appcontext";
import {modifyOrders} from "../firebase";

const DeliveredMessage = ({show, handleClose, orderId}) => {
    const {enqueueSnackbar} = useSnackbar();
    const {orders, store} = React.useContext(AppContext);
    if(!orderId || !orders[orderId]){
        return null;
    }
    return (
            <Snackbar open={show} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    action={
                        <Button color="inherit" size="small">
                            UNDO
                        </Button>
                    }
                    >
                        Order {orders[orderId].checkNumber} for {orders[orderId.firstName]} marked delivered 
                </Alert>
            </Snackbar>
    )
}

export default DeliveredMessage;