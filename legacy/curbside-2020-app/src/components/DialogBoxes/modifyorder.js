import React, {useEffect, useState} from "react";

import {Paper, Grid, Button, ButtonGroup, Dialog, DialogContent, TextField, IconButton, DialogActions, FormControlLabel, Checkbox, Toolbar, Box, InputBase, Fab, Menu, DialogTitle, List, ListItem, ListItemText} from "@material-ui/core";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";


import {AppContext} from "../../utils/appcontext";
import {modifyOrders} from "../firebase";
import {useSnackbar, closeSnackbar} from 'notistack';


const ModifyDialog = ({show, setShow, orderId}) => {
    // Variables from App Context
    const {store, orders} = React.useContext(AppContext)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();


    // Instantiate state
    const [currentOrder, setCurrentOrder] = React.useState({});
    // View States
    const [showModifyForm, setShowModifyForm] = React.useState(false);
    const [showConfirmBox, setShowConfirmBox] = React.useState(true);

    
    // Functions
    const handleModifyClose = () => {
        setShowModifyForm(!showModifyForm);
    }

    const exit = () => {
        setShow(false);
    }

    const deleteOrder = (order) => {
        setCurrentOrder({...order});
        setShowConfirmBox(true);
    }

    const updateOrder = (order) => {
        const tempOrder = currentOrder;
        tempOrder.promisedTime = moment(tempOrder.promisedTime).format();
        modifyOrders(orderId, currentOrder, store).then(()=>{
            setCurrentOrder(null);
            enqueueSnackbar("Order " + currentOrder.checkNumber + " for " + currentOrder.firstName + " was updated", {
                variant: 'info',
                autoHideDuration: 5000, 
                action: (key)=>{
                    return(
                        <React.Fragment>
                            <Button
                            onClick={()=>{
                                closeSnackbar(key)
                            }}
                            >
                                Dismiss
                            </Button>
                        </React.Fragment>

                    )
                }
            });
        });
        exit();
    }
    const message = () => {             
        enqueueSnackbar("Order " + currentOrder.checkNumber + " for " + currentOrder.firstName + " was " + (!currentOrder.deleted ? 'restored' : 'deleted'), {
        variant: !currentOrder.deleted ? 'info' : 'error',
        autoHideDuration: 5000, 
        action: (key)=>{
            return(
                <React.Fragment>
                    <Button
                    onClick={()=>{
                        closeSnackbar(key)
                    }}
                    >
                        Dismiss
                    </Button>
                </React.Fragment>

            )
        }
    });}
    const confirmOrder = (order) => {
        console.log(currentOrder)
        modifyOrders(orderId, currentOrder, store).then(()=>{
            console.log("Why does this hate messages?")
            message();
        })
        exit();
    }
    
    useEffect(()=>{
        if(show){
            var tempOrder = {...orders[orderId]}
            setCurrentOrder({...tempOrder})
            setShowModifyForm(true);
        } else {
            setShowModifyForm(false);
            setShowConfirmBox(false);
        }
    }, [show])
    
    return(
        <React.Fragment>
            <ModifyForm show={showModifyForm} handleClose={handleModifyClose} updateOrder={updateOrder} deleteOrder={deleteOrder} check={currentOrder} setCheck={setCurrentOrder} exit={exit} />
            <ConfirmDeleteActionDialog show={showConfirmBox} handleClose={exit} updateOrder={confirmOrder} orderId={orderId} />
        </React.Fragment>
    )
}

export const ConfirmDeleteActionDialog = ({show, handleClose, updateOrder, orderId}) =>{
    const {orders} = React.useContext(AppContext);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const message = () => {             
        enqueueSnackbar("Order " + orders[orderId].checkNumber + " for " + orders[orderId].firstName + " was " + (!orders[orderId].deleted ? 'restored' : 'deleted'), {
        variant: !orders[orderId].deleted ? 'info' : 'error',
        autoHideDuration: 5000, 
        action: (key)=>{
            return(
                <React.Fragment>
                    <Button
                    onClick={()=>{
                        closeSnackbar(key)
                    }}
                    >
                        Dismiss
                    </Button>
                </React.Fragment>

            )
        }
    });}
    if(!orderId || !orders[orderId]){
        return(null)
    } else {
        const action = (orders[orderId]).deleted ? "restore" : "delete"
      return(
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
                        onClick={()=>{
                            updateOrder();
                            
                        }}
                  >
                      {action}
                  </Button>
                  <Button onClick={handleClose}>
                      Cancel
                  </Button>
              </DialogActions>
          </Dialog>
  
      )  
      }
  }
const ModifyForm = ({show, handleClose, updateOrder, check, setCheck, exit, deleteOrder}) =>{
    {
        const handleChange = (e, index) =>{
            const value = e.target.value;
            const tempCheck = check;
            tempCheck[index] = value;
            console.log(e);
            setCheck({...tempCheck});
        }
        const handleTimeChange = (e, index) => {
            const value = e;
            const tempCheck = check;
            tempCheck[index] = value;
            setCheck({...tempCheck});
        }
        const handleCheckedChange = (e, index) => {
            const value = e.target.checked;
            const tempCheck = check;
            tempCheck[index] = value;
            setCheck({...tempCheck});
        }
        const submit = () =>{
            updateOrder(check);
            setCheck(null);
            handleClose();
        }
        const deleteSubmit = () => {
            const tempCheck = {... check};
            tempCheck.deleted = !tempCheck.deleted;
            deleteOrder(tempCheck);
            handleClose();
        }
        if(check){
        return(
            <Dialog open={show} onClose={exit}>
                <DialogContent>
                    Please fill out all information for the Check
                </DialogContent>
                <DialogContent>
                    <form autoComplete="off">
                    <TextField
                        id="checkNumber"
                        label="Check Number"
                        value={check.checkNumber}
                        onChange={(e)=>{
                            handleChange(e, "checkNumber")
                        }}
                        fullWidth
                    />
                    <br />
                    <TextField
                        id="firstName"
                        label="First Name"
                        value={check.firstName}
                        onChange={(e)=>{
                            handleChange(e, "firstName")
                        }}
                        fullWidth
                    />
                    <br />
                    <TextField
                    
                        id="lastName"
                        label="Last Name"
                        value={check.lastName}
                        onChange={(e)=>{
                            handleChange(e, "lastName")
                        }}
                        fullWidth
                    />
                    <br />
                    <TextField
                        id="phone"
                        label="Phone Number"
                        value={check.phone}
                        onChange={(e)=>{
                            handleChange(e, "phone")
                        }}
                        fullWidth
                    />
                    <br />
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                    <KeyboardTimePicker
                        variant="inline"
                        label="Promised Time"
                        value={check.promisedTime}
                        onChange={(e)=>{
                            console.log(e)
                            handleTimeChange(e, "promisedTime")
                        }}
                    />
                        <TextField
                        id="spotNumber"
                        label="Spot Number"
                        value={check.spotNumber}
                        onChange={(e)=>{
                            handleChange(e, "spotNumber")
                        }}
                        fullWidth
                         />
                        <br />
                    </MuiPickersUtilsProvider>
                    <br />
                    <Grid container>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.paid}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "paid")
                                    }}
                                    color="primary"
                                    name="paid"
                                    />
                            }
                            label="Paid"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.bagged}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "bagged")
                                    }}
                                    color="primary"
                                    name="bagged"
                                    />
                            }
                            label="Bagged"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.arrived}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "arrived")
                                    }}
                                    color="primary"
                                    name="arrived"
                                    />
                            }
                            label="Arrived"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.delivered}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "delivered")
                                    }}
                                    color="primary"
                                    name="delivered"
                                    />
                            }
                            label="Delivered"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.needsToOrder}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "needsToOrder")
                                    }}
                                    color="primary"
                                    name="needstoorder"
                                    />
                            }
                            label="Needs to Order"
                        />
                        </Grid>
                        <Grid item xs={4}>
                                            <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.futureOrder}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "futureOrder")
                                    }}
                                    color="primary"
                                    name="futureorder"
                                    />
                            }
                            label="Future Order"
                        />
                        </Grid>
                        <Grid item xs={4}>                                    
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.rtgSteaks}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "rtgSteaks")
                                    }}
                                    color="primary"
                                    name="rtgSteaks"
                                    />
                            }
                            label="Ready to Grill Steaks"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.needManager}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "needManager")
                                    }}
                                    color="primary"
                                    name="needManager"
                                    />
                            }
                            label="Needs a Manager"
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check.farmersMarket}
                                    onChange={(e)=>{
                                        handleCheckedChange(e, "farmersMarket")
                                    }}
                                    color="primary"
                                    name="market"
                                    />
                            }
                            label="Farmer's Market"
                        />
                        </Grid>
                    </Grid>
                    </form>
                </DialogContent>
            <DialogActions>
                <Button onClick={exit} color="default">Cancel</Button>
                <Button onClick={deleteSubmit} color="secondary">{check.deleted ? "Restore" : "Delete"}</Button>
                <Button onClick={submit} color="primary">Submit</Button>
            </DialogActions>
            </Dialog>
        );
        } else {
            return(
                <div>

                </div>
            );
        }
    }
}


export default ModifyDialog;