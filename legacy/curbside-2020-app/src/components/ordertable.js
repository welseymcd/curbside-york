import React, {useEffect, useState} from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import firebase from "./firebase.js";
import {purple, red, blue } from '@material-ui/core/colors';

// Custom elements
import SpotTransfer from "./ParkingLot/parkinglotcontrol.js";
import {FormControlLabel, Checkbox, Paper, Grid, Hidden, MenuItem, Snackbar, Typography, Container, AppBar, Button, Dialog, DialogContent, TextField, IconButton, DialogActions,  Toolbar, Box, InputBase, Fab, Menu, DialogTitle} from "@material-ui/core";
import { KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {
    Link,
  } from "react-router-dom";

import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckIcon from '@material-ui/icons/Check';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

import {useSnackbar} from 'notistack';


import {AppContext} from "../utils/appcontext";
import {useStyles} from "../utils/styles";
import ConfirmedBaggedDialog from "./DialogBoxes/confirmbagged";
import DeletedTable from "./deletedtable";
import ModifyDialog from "./DialogBoxes/modifyorder";
import {PositionTitles, positionIndex, positions, emptyCheck} from "../utils/consts";
import {modifyOrders} from "./firebase";



const searchOptions = {
    "name": "Name",
    "checkNumber": "CHK #",
    "phone": "Phone"
}


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
const OrderTable = (props) =>{
    const classes = useStyles();
    const database = firebase.database();

    const [searchEl, setSearchEl] = useState(null);
    const [searchIndex, setSearchIndex] = useState("name");
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    

    const {orders, store, selectedPosition, setSelectedPosition, spotIndex} = React.useContext(AppContext);
    //const [orders, setOrders] = useState({});
    const [selectedSpace, setSelectedSpace] = useState({
        index: 0,
        key: ""
    });


    // Dialog Open States
    const [showDialog, setShowDialog] = useState(false);
    const [showSpot, setShowSpot] = useState(false);
    const [showModify, setShowModify] = useState(false);
    const [showArrivedRemove, setShowArrivedRemove] = useState(false);
    const [showConfirmedPaid, setShowConfirmedPaid] = useState(false);
    const [showConfirmedBagged, setShowConfirmedBagged] = useState(false);
    const [showSpotTransfer, setShowSpotTransfer] = useState(false);

    // Orders being modified by a dialog box
    const [arrivedRemove, setArrivedRemove] = useState("");
    const [modifiedSpot, setModifiedSpot] = useState("");
    const [modifyOrder, setModifyOrder] = useState("");

    // Menu States
    const [positionMenu, setPositionMenu] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [sortIndex, setSortIndex] = useState("checkNumber");

    

    const date = moment();
    const handleDialog = () => {
        setShowDialog(!showDialog);
    }
    const addCheck = check => {
        check["arrived"] = false;
        check["bagged"] = false;
        check["delivered"] = false;
        check['spotNumber'] = "NA";
        check['arrivalTime'] = "";
        check['enteredTime'] = moment().format();
        check['paidTime'] = '';
        check['baggedTime'] ='';
        check.promisedTime = moment(check.promisedTime).format();
        console.log(check);
        database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/").push(check);
    }

    const handleDelivered = (orderId) =>{
        console.log("Delivered " + orderId);
        setModifyOrder(orderId);
        toggleState(orderId, "delivered", true).then(()=>{
            console.log(orderId)
            const tempOrder = orders[orderId];
            enqueueSnackbar("Order " + tempOrder.checkNumber + " for " + tempOrder.firstName + " marked delivered", {
                variant: 'info', 
                autoHideDuration: 5000,
                action: (key) => {
                    return <React.Fragment>
                        <Button
                            onClick={()=>{
                                tempOrder.delivered = !tempOrder.delivered;
                                console.log(orderId);
                                modifyOrders(orderId, tempOrder, store).then(()=>{
                                    enqueueSnackbar("Order " + tempOrder.checkNumber + " for " + tempOrder.firstName + " was updated", {
                                        variant: 'success',
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
                            }}
                        >
                            Undo
                        </Button>
                        <Button
                            onClick={()=>{
                                closeSnackbar(key)
                            }}
                        >
                            Dismiss
                        </Button>
                    </React.Fragment>
                }
            })
        });
    }
    const handleSearchMenu = (index) => {
        if(typeof index === "string") {
            setSearchIndex(index)
        }
        setSearchEl(null);
    }
    const handleConfirmedPaid = () => {
        setShowConfirmedPaid(!showConfirmedPaid)
    }
    const handleConfirmedBagged = () => {
        setShowConfirmedBagged(!showConfirmedBagged);
    }

    const handleTransfer = (spotNumber) => {
        setSelectedSpace(spotIndex[spotNumber]);
        setShowSpotTransfer(true);
    }

    const handleSearchMenuClick=(e)=>{
        setSearchEl(e.currentTarget);
    }
    const handlePositionMenu = (index) => {
        if(typeof index === "number"){
            setSelectedPosition(index);
            sessionStorage.position = index;
        }
        setPositionMenu(null);
    }
    const handlePositionMenuClick = (e) =>{
        setPositionMenu(e.currentTarget)
    }
    const updateOrder =(order, index) =>{
        index = index || modifyOrder
        console.log("Updated Check");
        order.promisedTime = moment(order.promisedTime).format();
        database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/" + index).update(order);
    }



    const toggleState = (key, cat, state) =>{
        if(cat === "bagged") {
            setModifyOrder(key);
            handleConfirmedBagged();
        } else {
            const tempOrder = orders[key];
            tempOrder[cat] = state;
            if(state){
                tempOrder[cat+"Time"] = moment().format();
            } else {
                tempOrder[cat+"Time"] = "";
            }
            return database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/" + key).set(tempOrder);
        }
    }

    // Dialog Box Functions
    const toggleArrivedRemove = () =>{
        setShowArrivedRemove(!showArrivedRemove);
    }
    const openArrivedRemove = (key) => {
        console.log(key);
        setArrivedRemove(key);
        toggleArrivedRemove();
    }

    const openSpot = (key) => {
        setModifiedSpot(key);
        setShowSpot(true);
    }
    const toggleSpot = () => {
        setShowSpot(!showSpot);
    }
    const updateSpot = (spot) => {
        const tempOrder = orders[modifiedSpot];
        tempOrder.arrivalTime = moment().format();
        tempOrder.spotNumber = spot;
        tempOrder.arrived = true;
        updateOrder(tempOrder, modifiedSpot);
    } 
     
    return (
        <Box>
            <Toolbar>
                    <Button 
                        size="small" 
                        style={{color: "black"}}
                        onClick={handleSearchMenuClick}    
                    >
                        <Typography variant="h6">
                            {searchOptions[searchIndex]}
                        </Typography>
                    </Button>
                    <Menu
                        id="search-menu"
                        anchorEl={searchEl}
                        keepMounted
                        open={Boolean(searchEl)}
                        onClose={handleSearchMenu}
                    >
                        <MenuItem onClick={(e)=>handleSearchMenu("name")}>Name</MenuItem>
                        <MenuItem onClick={(e)=>handleSearchMenu("checkNumber")}>Check</MenuItem>
                        <MenuItem onClick={(e)=>handleSearchMenu("phone")}>Phone</MenuItem>
                    </Menu>
                    <div className={classes.search}>

                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search..."
                            type={(searchIndex==="name") ? "text" : "number"}
                            value={searchText}
                            onChange={(e)=>setSearchText(e.target.value)}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                              }}
                            inputProps={{'aria-label': 'search'}}
                            />
                        </div>
                            <Hidden smDown><span style={{marginRight: "auto", marginLeft: "auto"}}><Clock /></span></Hidden>

                            <Typography style={{marginLeft: "auto"}} className={classes.title} variant="h6" noWrap>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handlePositionMenuClick}
                                >
                                <MoreVertIcon style={{color: "black"}}/>
                            </IconButton>
                                <Hidden smDown>Position: </Hidden>{positions[selectedPosition].title}
                            </Typography>


                    <Menu
                        id="position-menu"
                        anchorEl={positionMenu}
                        keepMounted
                        open={Boolean(positionMenu)}
                        onClose={handlePositionMenu}
                    >
                        {positions.map((position, index)=>{
                            return(
                                (index !== 5) ?
                                    <MenuItem key={index} onClick={(e)=>handlePositionMenu(index)}>{(index === selectedPosition) ? <CheckIcon /> : null}{position.title}</MenuItem>
                                    :
                                    <MenuItem key={index}><Link style={{textDecoration: "none", color: "black"}} to="/traffic">Traffic Controller</Link></MenuItem>

                            )
                        })}
                    </Menu>
            </Toolbar>
        <Paper>
            <SpotTransfer show={showSpotTransfer} setShow={setShowSpotTransfer} selectedOldSpace={selectedSpace} />
            <SpotForm show={showSpot}  handleClose = {toggleSpot} updateSpot={updateSpot} />
            <OrderForm updateOrder={updateOrder} show={showDialog} handleClose={handleDialog} submitHandle={addCheck} />
            <ModifyDialog show={showModify} setShow={setShowModify} orderId={modifyOrder} />
            <ConfirmPaidDialog orders={orders} show={showConfirmedPaid} handleClose={handleConfirmedPaid} updateOrder={toggleState} index={modifyOrder} />
            <ConfirmedBaggedDialog show={showConfirmedBagged} handleClose={handleConfirmedBagged} orderId={modifyOrder} />
            <RemoveSpotDialog show={showArrivedRemove} handleClose={toggleArrivedRemove} updateOrder={toggleState} index={arrivedRemove} />
                {
                (positionIndex[PositionTitles.deleted] === selectedPosition) ?
                    <DeletedTable searchText={searchText} searchIndex={searchIndex} /> :
                    <Paper >
                        <Grid style={{paddingTop: 16}} container>
                    <Grid container>
                        <Grid item xs={2} sm={1}>
                            <Button size="small" onClick={()=> setSortIndex("checkNumber")}>
                                {(sortIndex === "checkNumber") ? <ArrowDropUpIcon fontSize="small" /> : null}
                                <Hidden smDown>CHK </Hidden>#</Button>
                        </Grid>
                        <Grid  item xs={2} sm={1}>
                            <Button 
                                size="small">
                                    SPOT
                            </Button>
                        </Grid>
                        <Grid item xs={2} sm={3} md={2}>
                            <Button size="small" onClick={()=> setSortIndex("name")}>
                            {(sortIndex === "name") ? <ArrowDropUpIcon fontSize="small" /> : null}
                                Name
                            </Button>
                        </Grid>
                        <Hidden smDown>
                            <Grid item sm={2}>
                            <Button size="small">
                                {(selectedPosition) !== 4 ? "PHONE" : "Arrival Time"}
                            </Button>
                            </Grid>
                        </Hidden>
                        <Hidden xsDown>
                            <Grid item sm={2} md={1}>
                                <Button size="small">
                                    PROMISE TIME
                                </Button>
                            </Grid>
                        </Hidden>
                        {selectedPosition !== 3 ? (
                            <React.Fragment>
                            <Grid item xs={2} sm={1}>
                                <Button size="small">
                                    PAID
                                </Button>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <Button size="small">
                                    BAGGED
                                </Button>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <Button size="small">
                                    ARRIVED
                                </Button>
                            </Grid>
                        </React.Fragment>)
                        : ( <React.Fragment>
                            <Grid item xs={3} sm={2}>
                                <Button size="small">
                                    PAID
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button size="small">
                                    Arrival Time
                                </Button>
                            </Grid>
                            
                            </React.Fragment>) }
                    </Grid>
                    
                    {
                        Object.keys(orders)
                        .filter((key)=>{
                            const order = orders[key];
                            const position = positions[selectedPosition];
                            const paidBool = (position.paid !== null ? position.paid === order.paid : true);
                            const arrivedBool = (position.arrived !== null ? position.arrived === order.arrived : true);
                            const baggedBool = (position.bagged !== null ? position.bagged === order.bagged : true);
                            if(order.deleted) {
                                return false;
                            }
                            if(position.delivered){
                                if(searchText === ""){
                                    return order.delivered
                                } else {
                                    let searchString = searchIndex === "name" ? (order.firstName + " " + order.lastName) : order[searchIndex].toString();
                                    return (order.delivered && searchString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
                                }
                            }
                            if(position.farmersMarket){
                                if(order.farmersMarket) { 
                                    return (!order.delivered && order.arrived && true);
                                } else {
                                    return false;
                                }
                            }
                            if(searchText === ""){
                                return (!order.delivered&& !order.farmersMarket && paidBool && arrivedBool && baggedBool);
                            } else {
                                let searchString = searchIndex === "name" ? (order.firstName + " " + order.lastName) : order[searchIndex].toString();
                                return (!order.delivered && !order.farmersMarket && paidBool && arrivedBool && baggedBool && searchString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
                            }
                        })
                        .sort((a, b)=>{
                            if(sortIndex === "name"){
                                return (orders[a]['firstName'].toLowerCase() + " " + orders[a]['lastName'].toLowerCase()).localeCompare((orders[b]['firstName'].toLowerCase() + " " + orders[b]['lastName'].toLowerCase()))
                            }
                            if(selectedPosition === 3) {
                                if(moment(orders[a].arrivalTime).isAfter(moment(orders[b].arrivalTime))){
                                    return -1;
                                } else if(moment(orders[a].arrivalTime).isSame(moment(orders[b].arrivalTime))){
                                    return 0
                                }
                                return 1;
                            } 
                            if(selectedPosition === 4){
                                if(moment(orders[a].baggedTime).isAfter(moment(orders[b].baggedTime))){
                                    return 1;
                                } else if(moment(orders[a].baggedTime).isSame(moment(orders[b].baggedTime))){
                                    return 0
                                } else if (orders[a].baggedTime === ""){
                                    return 1;
                                }
                                return -1;
                            }
                            return orders[a][sortIndex] - orders[b][sortIndex];
                        })
                        .map((key, index)=>{
                            const order = orders[key];
                            return(
                                <OrderRow handleTransfer={handleTransfer} orders={orders} setShowConfirmedPaid={setShowConfirmedPaid} selectedPosition={selectedPosition} openArrivedRemove={openArrivedRemove} setModifyOrder={setModifyOrder} setShowModify={setShowModify} row={index} key={key} index={key} toggleState={toggleState} order={order} delivered={handleDelivered} setShowSpot={openSpot} />
                            )
                        })
                    }
                </Grid>
                    </Paper>
                }
        </Paper>
            <Fab 
                onClick={()=>{
                    setShowDialog(true);
                }}
                style={{
                    visibility: (selectedPosition !== 6) ? "hidden" : "visible",
                    bottom: 16, 
                    right: 16, 
                    position: 'fixed'
                }}
                color="primary" 
                aria-label="add">
                    <AddIcon />
            </Fab>
        </Box>
    )
}

export const SearchBox = ({searchIndex, setSearchIndex, searchText, setSearchText})=>{
    const classes = useStyles();
    const [searchEl, setSearchEl] = useState(null);
    const handleSearchMenuClick=(e)=>{
        setSearchEl(e.currentTarget);
    }
    const handleSearchMenu = (index) => {
        if(typeof index === "string") {
            setSearchIndex(index)
        }
        setSearchEl(null);
    }
    return(
        <React.Fragment>
            <Button 
                size="small" 
                style={{
                    color: "black",
                    marginLeft: "12px",
                    marginRight: "-12px"
                 }}
                onClick={handleSearchMenuClick}    
            >
                <Typography>
                    {searchOptions[searchIndex]}
                </Typography>
            </Button>
            <Menu
                id="search-menu"
                anchorEl={searchEl}
                keepMounted
                open={Boolean(searchEl)}
                onClose={handleSearchMenu}
            >
                <MenuItem onClick={(e)=>handleSearchMenu("name")}>Name</MenuItem>
                <MenuItem onClick={(e)=>handleSearchMenu("checkNumber")}>Check</MenuItem>
                <MenuItem onClick={(e)=>handleSearchMenu("phone")}>Phone</MenuItem>
            </Menu>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search..."
                    type={(searchIndex==="name") ? "text" : "number"}
                    value={searchText}
                    onChange={(e)=>setSearchText(e.target.value)}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    />
            </div>
        </React.Fragment>
        );
}

const OrderRow = ({order, delivered, toggleState, index, row, handleTransfer, setShowSpot, setShowModify, setModifyOrder, openArrivedRemove, selectedPosition, setShowConfirmedPaid}) =>{
    const classes = useStyles();
    return(
        <Grid className={classes.row}  style={{backgroundColor: row % 2 === 1 ? "#DCDCDC" : "white", paddingTop: "2px", paddingBottom: "2px"}} container>
                <Grid style={{margin: "auto"}} item xs={2} sm={1}>{order.checkNumber}</Grid>
                <Grid style={{margin: "auto"}} item xs={2} sm={1}>
                    <Button 
                        size="small"
                        onClick={()=>{
                            handleTransfer(order.spotNumber);
                        }}
                    >
                        {order.spotNumber}
                    </Button>
                </Grid>
                <Grid style={{margin: "auto"}} item xs={2} sm={3} md={2}>
                    <Button
                    style={{color: (order.needsToOrder) ? (blue[500]) : (order.futureOrder) ? purple[700] : (order.needManager) ? red[700] : "black"}} 
                    onClick={()=>{
                        setModifyOrder(index);
                        setShowModify(true);
                    }}
                >
                    {(order.checkNumber === "" && (selectedPosition === 3 || selectedPosition === 4)) ?
                        order.firstName + " " + ((order.needsToOrder) ? "needs to order" : (order.futureOrder) ? "is a future order" : (order.needManager) ? "needs a manager" : (order.rtgSteaks) ? "RTG Steaks" : order.lastName )
                    : order.firstName + " " + order.lastName
                }</Button></Grid>
                <Hidden smDown>
                    <Grid style={{margin: "auto"}} item sm={2}>
                        {(selectedPosition !== 4) ? order.phone : moment(order.arrivalTime).format("hh:mm a") }
                    </Grid>
                </Hidden>
                <Hidden xsDown>
                    <Grid style={{margin: "auto"}} item sm={2} md={1}>
                        <Typography
                        color={moment().isAfter(order.promisedTime) ? "error" : "initial"}
                        >{moment(order.promisedTime).format("hh:mm a")}</Typography>
                    </Grid>
                </Hidden>

                {
                    (order.delivered) ?
                        <Grid style={{margin: "auto"}}  item xs={6} sm={5}> 
                            <Typography>Completed</Typography>
                        </Grid>
                    :
                    (order.paid === true && order.bagged === true && order.arrived === true) ? 
                        <Grid style={{margin: "auto"}}  item xs={6} sm={5}>
                            <Button 
                                variant="contained"
                                color="primary"
                                onClick = {()=>{
                                    console.log(index);
                                    delivered(index);
                                }}
                            >READY</Button>
                        </Grid>  

                :
                selectedPosition !== 3 ? (
                <React.Fragment>
                <Grid style={{margin: "auto"}}  item xs={2} sm={1}>
                    <Button
                            onClick={()=>{
                                if(!order.paid){
                                    console.log(index);
                                    setModifyOrder(index);
                                    setShowConfirmedPaid(true);   
                                } else {
                                    toggleState(index, "paid", !order.paid);
                                }

                            }}
                    >{order.paid === true ? "Paid" : "Unpaid"}</Button>
                </Grid>
                <Grid style={{margin: "auto"}}  item xs={2} sm={2}>
                    <Button
                        onClick={()=>{
                            toggleState(index, "bagged", !order.bagged);
                        }}
                    >{order.bagged === true ? "Bagged" : "Not Bagged"}</Button>
                </Grid>
                <Grid style={{margin: "auto"}}  item xs={2} sm={2}>
                    <Button
                        onClick={()=>{
                            if(!order.arrived){
                                setShowSpot(index);
                            } else {
                                console.log(index);
                                openArrivedRemove(index)
                            }
                        }}
                    >{order.arrived === true ? "Here" : "Not Here"}</Button>
                </Grid>
                </React.Fragment> )
                : 
                <React.Fragment>
                    <Grid style={{margin: "auto"}}  item xs={3} sm={2}>
                        <Button
                            onClick={()=>{
                                console.log(index);
                                setModifyOrder(index);
                                setShowConfirmedPaid(true);
                            }}
                        >{order.paid === true ? "Paid" : "Unpaid"}</Button>
                    </Grid>
                    <Grid style={{margin: "auto"}}  item xs={3} >
                        <Button>{moment(order.arrivalTime).format("hh:mm a")}</Button>
                    </Grid>
                </React.Fragment>
                }

        </Grid>
    )
}

const SpotForm = ({handleClose, show, check, updateSpot}) => {
    const [spot, setSpot] = useState("");
    const handleClick = () => {
        updateSpot(spot);
        setSpot("");
        handleClose();
    }
    const handleChange = (e) => {
        setSpot(e.target.value);
    }
    return (
        <Dialog open={show} onClose={handleClose}>
            <DialogContent>
                Please enter the spot Number
            </DialogContent>
            <DialogContent>
            <form autoComplete="off" onSubmit={(e)=>{
                e.preventDefault();
                handleClick();

            }}>
                <TextField
                    autofocus
                    id="spot"
                    label="Spot Number"
                    inputRef={input => input && input.focus()}
                    value={spot}
                    onChange={handleChange}
                    fullWidth
                />
                <br />
            </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClick}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}
const OrderForm = ({show, handleClose, submitHandle, updateOrder}) =>{
    const [check, setCheck] = useState({...emptyCheck})
    const {orders} = React.useContext(AppContext);
    const [selectedOrderEntry, setSelectedOrderEntry] = useState("");
    const [showEnterError, setShowEnterError] = useState(false);
    const handleChange = (e, index) =>{
        const value = e.target.value;
        const tempCheck = check;
        tempCheck[index] = value;
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
        const tempCheck = {...check};
        tempCheck[index] = value;
        setCheck({...tempCheck});
    }
    const handleSnackClose = () => {
        setShowEnterError(!showEnterError)
    }
    const submit = () =>{
        if(check.firstName!=="" && check.checkNumber !== "" && check.lastName){
            if(selectedOrderEntry === ""){
                submitHandle(check);
            } else {
                const tempCheck = check;
                tempCheck.needsToOrder = false;
                tempCheck.futureOrder = false;
                updateOrder(tempCheck, selectedOrderEntry);
                setSelectedOrderEntry("")
            }
            setCheck({...emptyCheck});
        } else {
            setShowEnterError(true);
        }

    }
    
    const classes = useStyles();
    return(
        <Dialog fullScreen open={show} onClose={handleClose}>
            <Snackbar open={showEnterError} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="error">
                    Error! Either the check number, first name or last name is blank
                </Alert>
            </Snackbar>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                Order Entry
                </Typography>

            </Toolbar>
        </AppBar>
            <Container style={{paddingTop: 68}} maxWidth="sm">
            <Typography variant="h5">Orders Waiting for Check</Typography>
                <Box style={{
                    maxHeight: "75px",
                    minHeight: "75px",
                    overflowY: "scroll",
                    overflowX: "hide",
                }}> 
                    <Grid container>
                        {Object.keys(orders).filter((key)=>{
                            const order = orders[key];
                            if(!order.delivered && !order.deleted) {
                                if(check.firstName !== ""){
                                    return (order.futureOrder || order.needsToOrder || order.rtgSteaks) && order.firstName.toLowerCase().indexOf(check.firstName.toLowerCase()) !== -1
                                } else {
                                    return (order.futureOrder || order.needsToOrder || order.rtgSteaks);
                                }
                            }
                            return false;
                        }).map((key)=>{
                            const order=orders[key]
                            return(
                                <Grid key={key} container item xs={12}>
                                    <Grid item xs={6}>
                                        {order.firstName + " " + order.lastName}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {order.needsToOrder ? "Ordering Here" : order.futureOrder ? "Future Order" : order.rtgSteaks ? "Ready to grill" : "Needs a Manager"}
                                    </Grid>
                                    <Grid item xs={3}
                                        onClick={()=>{
                                            setSelectedOrderEntry(key);
                                            setCheck(order);
                                        }}
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >
                                        <span>
                                            Use
                                        </span>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
                <form  noValidate autoComplete="off">
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
                <TextField
                    id="checkNumber"
                    label="Check Number"
                    value={check.checkNumber}
                    type="number"
                    onChange={(e)=>{
                        handleChange(e, "checkNumber")
                    }}
                    fullWidth
                />
                <br />
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
                <br />
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                <KeyboardTimePicker
                    variant="inline"
                    label="Promised Time"
                    value={check.promisedTime}
                    onChange={(e)=>{
                        handleTimeChange(e, "promisedTime")
                    }}
                />

                </MuiPickersUtilsProvider>
                <br />
                </form>
                <Button onClick={submit} color="primary">Submit</Button>
            </Container>
        </Dialog>
    );
}

const ConfirmPaidDialog = ({orders, show, handleClose, updateOrder, index}) =>{
  if(!index || !orders[index]){
      return(null)
  } else {
    return(
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle>
                Would you like to confirm paid?
            </DialogTitle>
            <DialogContent>
                Are you sure you would like to mark {orders[index].firstName + " " +  orders[index].lastName } as paid?
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={()=>{
                        updateOrder(index, "paid", true);
                        handleClose();
                    }}
                >
                    Continue
                </Button>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>

    )  
    }
}
const RemoveSpotDialog = ({show, handleClose, updateOrder, index})=>{
    return(
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle>
                Would you like to remove spot?
            </DialogTitle>
            <DialogContent>
                By marking this person not here, you will remove their spot number? Are you sure you would like to continue?
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={()=>{
                        updateOrder(index, "arrived", false);
                        handleClose();
                    }}
                >
                    Continue
                </Button>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>

    )
}

const Clock = (props) => {
    const [time, setTime] = useState(moment());

    useEffect(()=>{
        let interval = null;
        interval = setInterval(()=>{
            setTime(moment());
        }, 1000);
        return ()=> clearInterval(interval);
    }, [time])

    return(
        <Typography variant="h4" component="h4">
            {time.format("hh:mm:ss")}
        </Typography>
    )
}

export default OrderTable;