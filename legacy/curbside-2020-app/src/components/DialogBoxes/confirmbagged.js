import React, { useEffect } from "react";
import moment from "moment";

import {Dialog, DialogTitle, DialogContent, Button, DialogActions, Snackbar} from "@material-ui/core"
import Alert from '@material-ui/lab/Alert';

import {AppContext} from "../../utils/appcontext";
import {modifyOrders} from "../firebase";
import {useSnackbar} from 'notistack';


const ConfirmBaggedDialog = ({show, handleClose, orderId}) => {

    const {orders, store} = React.useContext(AppContext);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();


    // View States
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showResults, setShowResults] = React.useState(false);
    const [showFailure, setShowFailure] = React.useState(false);


    const updateOrderAction = () => {
        const order = orders[orderId];
        if(!order.bagged) {
            order.baggedTime = moment().format();
            order.bagged = true;
        } else {
            order.baggedTime = "";
            order.bagged = false;
        }
        return modifyOrders(orderId, order, store);
    }

    const exit = () => {
        handleClose();
    }

    const handleResults = () => {
        setShowResults(!showResults);
    }

    const handleFailure = () => {
        setShowFailure(!showFailure);
    }
    
    const updateOrder = () => {
        exit();
        updateOrderAction().then(()=>{
            const order = orders[orderId];
            enqueueSnackbar("Order " + order.checkNumber + " for " + order.firstName + " was marked bagged", {
                variant: 'success',
                autoHideDuration: 5000, 
                action: (key)=>{
                    return(
                        <Button
                        onClick={()=>{
                            closeSnackbar(key)
                        }}
                        >
                            Dismiss
                        </Button>
                    )
                }
            });
        }).catch(()=>{
            const order = orders[orderId];

            enqueueSnackbar("Order " + order.checkNumber + " for " + order.firstName + " failed to update", {
                variant: 'error',
                autoHideDuration: 5000, 
                action: (key)=>{
                    return(
                        <Button
                        onClick={()=>{
                            closeSnackbar(key)
                        }}
                        >
                            Dismiss
                        </Button>
                    )
                }
            });
        });
    }

    useEffect(()=>{
        if(show){   
            setShowConfirm(show);
        } else {
            setShowConfirm(false);
            setShowResults(false);
            setShowFailure(false);
        }
    }, [show])
    return(
        <React.Fragment>
            <ConfirmBagActionDialog show={showConfirm} handleClose={handleClose} orderId={orderId} updateOrder={updateOrder} />
            <Snackbar open={showResults} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} serverity="success">
                    Successfully changed status!
                </Alert>
            </Snackbar>
            <Snackbar open={showFailure} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} serverity="error">
                    Failed to change the status!
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export const ConfirmBagActionDialog = ({show, handleClose, orderId, updateOrder}) =>{
    const {orders, store} = React.useContext(AppContext);

    if(!orderId || !orders[orderId]){
        return(null)
    } else {
        const action = (orders[orderId]).bagged ? "mark unbagged" : "bag"
      return(
          <React.Fragment>
            <Dialog open={show} onClose={handleClose}>
                <DialogTitle>
                    Would you like to {action} this order?
                </DialogTitle>
                <DialogContent>
                    Are you sure you would like to {action} {orders[orderId].firstName + " " +  orders[orderId].lastName}'s order?
                </DialogContent>
                <DialogActions>
                    <Button
                            color="secondary"
                            onClick={updateOrder}
                    >
                        {action}
                    </Button>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
          </React.Fragment>
      )  
      }
  }


export default ConfirmBaggedDialog