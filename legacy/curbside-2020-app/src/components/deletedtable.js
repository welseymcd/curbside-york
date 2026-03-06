import React, {useState} from "react";
import { Paper, Grid, Button } from "@material-ui/core";

import {modifyOrders} from "./firebase";
import {AppContext} from "../utils/appcontext";
import {useStyles} from "../utils/styles";
import ModifyDialog, {ConfirmDeleteActionDialog} from "./DialogBoxes/modifyorder";
import {useSnackbar} from 'notistack';



const DeletedTable = ({searchText, searchIndex}) => {
    const classes = useStyles();
    const {orders, store} = React.useContext(AppContext);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    
    // Instantiating state
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    
    // Dialog States
    const [showModify, setShowModify] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = React.useState(false);

    const updateOrder = (orderId) => {
        const order = orders[orderId];
        order.deleted = false;
        modifyOrders(orderId, order, store).then(()=>{
            enqueueSnackbar("Order " + order.checkNumber + " for " + order.firstName + " was " + (!order.deleted ? 'restored' : 'deleted'), {
                variant: !order.deleted ? 'info' : 'error',
                autoHideDuration: 4000, 
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
    }
    
    const openModify = (orderId) => {
        setSelectedOrder(orderId);
        setShowModify(true);
    }

    const confirmUpdateOrder = (orderId) => {
        setSelectedOrder(orderId);
        handleConfirm();
    }

    const handleConfirm = () => {
        setShowConfirmBox(!showConfirmBox);
    }

    const confirmOrder = () => {
        updateOrder(selectedOrder);
        handleConfirm();
    }
    
    return (
        <Paper>
            <ModifyDialog orderId={selectedOrder} show={showModify} setShow={setShowModify} />
            <ConfirmDeleteActionDialog show={showConfirmBox} handleClose={handleConfirm} updateOrder={confirmOrder} orderId={selectedOrder} />
            <Grid container>
                <Headers />
                {Object.keys(orders).filter((orderId)=>{
                    if(searchText === ""){
                        return orders[orderId].deleted;
                    } else {
                        let searchString = searchIndex === "name" ? (orders[orderId].firstName + " " + orders[orderId].lastName) : orders[orderId][searchIndex].toString();
                        return (orders[orderId].deleted && searchString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
                    }
                    
                }).map((orderId, row)=>{
                    return(<Row openModify={openModify} className={classes.row} style={{backgroundColor: row % 2 === 1 ? "#DCDCDC" : "white", paddingTop: "2px", paddingBottom: "2px"}} key={orderId} orderId={orderId} updateOrder={confirmUpdateOrder} />)
                })}
            </Grid>
        </Paper>
    )
}

const Row = (props) => {
    const {orderId, updateOrder, openModify} = props;
    const {orders} = React.useContext(AppContext);
    
    return(
        <Grid {... props} item xs={12} container>
            <Grid style={{margin: "auto"}} item xs={3}>
                <Button 
                    size="small" 
                    onClick={()=>{
                        openModify(orderId);
                    }}
                >
                    {orders[orderId].firstName + " " + orders[orderId].lastName}
                </Button>
            </Grid>
            <Grid style={{margin: "auto"}} item xs={3}>
                {orders[orderId].phone}
            </Grid>
            <Grid style={{margin: "auto"}} item xs={3}>
                <Button
                    onClick={
                        ()=>{
                            updateOrder(orderId);
                        }
                    }
                >
                    Restore
                </Button>
            </Grid>
        </Grid>
    )
}

const Headers = (props) => {
    return(
        <Grid container>
            <Grid style={{margin: "auto"}} item xs={3}>
                Name
            </Grid>
            <Grid style={{margin: "auto"}} item xs={3}>
                Phone
            </Grid>
            <Grid style={{margin: "auto"}} item xs={3}>
                Action
            </Grid>
        </Grid>
    )
}

export default DeletedTable;