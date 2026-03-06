import React, { useState } from "react";
import { Table, InputBase, TableRow, Grid, Button, AppBar, Toolbar, TableBody, IconButton, Typography, TableCell, Dialog, Container,
    DialogTitle, DialogContent, TextField, DialogActions, FormControlLabel, Box, RadioGroup, Radio
} from "@material-ui/core";

import firebase, {modifySpecificSpot} from "../firebase.js";
import moment from "moment";
import { fade, makeStyles } from '@material-ui/core/styles';
import {
    Switch,
    Route,
    useRouteMatch,
  } from "react-router-dom";
  import MuiAlert from '@material-ui/lab/Alert';
  import Snackbar from '@material-ui/core/Snackbar';

  
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';



import {AppContext} from "../../utils/appcontext";
import {Updater} from "./parkinglotcontrol";
import {emptyCheck} from "../../utils/consts";

const database = firebase.database();

export const ParkingStatuses = {
    Open: "open",
    Dirty: "dirty",
    Sat: "sat"
}


const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      fab: {
        backgroundColor: "green",
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
    },
  }));

  
const GuestManage = (props) => {
    const classes = useStyles();

    //Variables from contexts
    const {parkingLot, setParkingLot} = React.useContext(AppContext);
    const {orders, store} = React.useContext(AppContext);

    const [selectedSpace, setSelectedSpace] = useState("");
    const [selectedOrder, setSelectedOrder] = useState({});
    
    
    
    const [searchText, setSearchText] = useState("");
    
    
    const [showSpot, setShowSpot] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showMissingGuest, setShowMissingGuest] = useState(false);



    const date = moment();

    const handleSpotClose = () =>{
        setShowSpot(!showSpot);
    }

    const handleConfirmation = () => {
        setShowConfirmation(!showConfirmation);
    }
    const handleMissingGuest = () => {
        setShowMissingGuest(!showMissingGuest);
    }

    const toggleState = (key, cat, state) =>{
        const tempOrder = orders[key];
        tempOrder[cat] = state;
        if(cat==="arrived" & !state){
            tempOrder["spotNumber"] = "";
        } 
        if(state){
            tempOrder[cat+"Time"] = moment().format();
        }
        database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/" + key).set(tempOrder);
    }

    const addOrder = async (order, spot) => {
        const date = moment();
        const index = await database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/").push(order);
        console.log(index.key);
        console.log(index);
        setSelectedOrder(index.key);
        handleMissingGuest();
        setShowSpot(true);
    }
    const updateOrder =(order, index) =>{
        database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/" + index).update(order);
    }
    const updateSpot = (key, spot) => {
        const tempOrder = orders[key];
        var tempSpot = parkingLot[spot.index][spot.key];
        tempOrder["spotNumber"] = spot.key;
        tempOrder.arrivalTime = moment().format();
        updateOrder(tempOrder, key)
        tempSpot.status = ParkingStatuses.Sat;
        tempSpot.guest.key = key;
        modifySpecificSpot(store, tempSpot, spot.index, spot.key);
        toggleState(selectedOrder, "arrived", true);
    }
    let match = useRouteMatch();
    return(
        <Switch>
        <Box>

            <SpotSelection setSelectedSpace={setSelectedSpace} show={showSpot} handleClose={handleSpotClose} parkingLot={parkingLot} setParkingLot={setParkingLot} confirm={handleConfirmation} />
            <ConfirmDialog updateSpot={updateSpot} selectedOrder={selectedOrder} show={showConfirmation} handleClose={handleConfirmation} selectedSpace={selectedSpace} />
            <MissingGuestDialog addOrder={addOrder} show={showMissingGuest} handleClose={handleMissingGuest} />
            <Route exact path={match.url + "/"}>
            <Toolbar>
                <div className={classes.search}>

                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e)=>setSearchText(e.target.value)}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    />
                </div>
                <Button
                onClick={()=>{
                    setShowMissingGuest(true);
                }}
                >
                    Add Unlisted
                </Button>
            </Toolbar>

                <Grid container>
                    <Headers />
                    <Grid item xs={12} style={{minHeight: "50px", maxHeight: "200px", overflowY: "scroll", overflowX: "hidden"}}>
                    {
                        Object.keys(orders)
                        .filter((key)=>{
                            const order = orders[key];
                            if(searchText === ""){
                                return (!order.arrived);
                            } else {
                                let searchString = order.firstName + " " + order.lastName;
                                return (!order.arrived && searchString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
                            }
                        })
                        .map((key, index)=>{
                            const order = orders[key];
                            return(
                                <OrderRow order={order} key={key} index={key} setSelectedOrder={setSelectedOrder} setShowSpot={handleSpotClose} />
                            )
                        })
                    }
                    </Grid>

            </Grid>
            <Box 
                        style={{
                        }}>
                <Updater />
            </Box>
            </Route>
            <Route path={match.url+"/updater"}>
                <Updater  />
            </Route>
            </Box>
        
            </Switch>

    )
}


const Headers = (props) => {
    
    return (
        <Grid container>
            <Grid  item xs={2}>
                SPOT Number
            </Grid>
            <Grid item xs={4}>
                    Name
            </Grid>
            <Grid item sm={3}>
                <Button size="small">
                    Promise Time
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button size="small">
                    ARRIVED
                </Button>
            </Grid>
        </Grid>
    )
}

const OrderRow = ({order, setShowSpot, index, setSelectedOrder}) =>{
    return(
    <Grid container>
        <Grid item xs={2} >
            {order.spotNumber}
        </Grid>
        <Grid item xs={4} style={{color: (order.farmersMarket) ? "green" : "black"}}>
            {order.firstName + " " + order.lastName}
        </Grid>
        <Grid xs={3}>
            {moment(order.promisedTime).format("hh:mm a")}
        </Grid>
        <Grid item sm ={3}>
            <Button
                onClick={()=>{
                    if(!order.arrived){
                        setShowSpot(true);
                        setSelectedOrder(index);
                    } else {
                        //openArrivedRemove(index)
                    }
                }}
            >{order.arrived === true ? "Here" : "Not Here"}</Button>
        </Grid>
    </Grid>
    );
}


const SpotSelection = ({show, handleClose, parkingLot, setParkingLot, setSelectedSpace, confirm}) => {
    return(
        <Dialog fullScreen open={show} onClose={handleClose}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" style={{color: "white"}}>
                    Spot Selection
                    </Typography>

                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
                <ParkingLotLayout parkingLot={parkingLot} setParkingLot={setParkingLot} setSelectedSpace={setSelectedSpace} handleClose={handleClose} confirm={confirm} />
            </Container>
        </Dialog>
    )
}
const ParkingLotLayout = ({parkingLot, setParkingLot, setSelectedSpace, handleClose, confirm}) =>{

    return(
    <Table>
    <TableBody>

    {
        parkingLot.map((section, index)=>{
            var count = 0;
            return (
                <TableRow>
                    {
                        Object.keys(section).map((key)=>{
                            if(count > 11) {
                                count = 0;
                            }
                            return (
                           <TableCell
                                onClick={()=>{
                                    console.log(parkingLot)
                                    var tempParking = parkingLot;
                                    if(tempParking[index][key].status === ParkingStatuses.Dirty) {
                                        tempParking[index][key].status = ParkingStatuses.Open;
                                        setParkingLot([...tempParking]);
                                    } else if (tempParking[index][key].status === ParkingStatuses.Open){
                                        setSelectedSpace({
                                            index: index,
                                            key: key
                                        });
                                        handleClose();
                                        confirm();
                                    }
                                }}
                                style={{cursor: "pointer", backgroundColor: (parkingLot[index][key].status === ParkingStatuses.Open) ? "green" : (parkingLot[index][key].status === ParkingStatuses.Dirty) ? "grey" : "tan", border: "15px solid #ececec", color: "white"}} align="center" size="medium">
                                {key}
                            </TableCell>
                            )
                        })
                    }
                </TableRow>
            )
        })
    }
    </TableBody>

</Table>
    );
}

export const ParkingLotView = ({orders, updateParkingSpot, parkingLot, setParkingLot, setSelectedSpace, setShowSpotChange}) => {
    return(
        <Table>
        <TableBody>
    
        {
            parkingLot.map((section, index)=>{
                return (
                    <TableRow>
                        {
                            Object.keys(section).map((key)=>{
                                /*
                                console.log(index);
                                console.log(key);
                                console.log(parkingLot[index][key].guest.key);
                                console.log(orders[parkingLot[index][key].guest.key]);
                                */
                                return (
                                <TableCell
                                    onClick={()=>{
                                        var tempParking = parkingLot;
                                        console.log(tempParking[index])
                                        if(orders[parkingLot[index][key].guest.key]){
                                            if(tempParking[index][key].status === ParkingStatuses.Dirty || orders[parkingLot[index][key].guest.key]['delivered']) {
                                                console.log("Updating spot")
                                                setSelectedSpace({
                                                    index: index,
                                                    key: key
                                                });
                                                setShowSpotChange(true);
    
                                            } else if (tempParking[index][key].status === ParkingStatuses.Open){
                                                console.log({
                                                    index: index,
                                                    key: key
                                                });
                                                console.log("Pressed while open")
                                            } else if (tempParking[index][key].status === ParkingStatuses.Sat) {
                                                setSelectedSpace({
                                                    index: index,
                                                    key: key
                                                });
                                                console.log("Open window");
                                                setShowSpotChange(true);
                                            }
                                        } else {
                                            if(tempParking[index][key].status === ParkingStatuses.Dirty) {
                                                console.log("Updating spot")
                                                setSelectedSpace({
                                                    index: index,
                                                    key: key
                                                });
                                                setShowSpotChange(true);
    
                                            } else if (tempParking[index][key].status === ParkingStatuses.Open){
                                                console.log({
                                                    index: index,
                                                    key: key
                                                });
                                                console.log("Pressed while open")
                                            } else if (tempParking[index][key].status === ParkingStatuses.Sat) {
                                                setSelectedSpace({
                                                    index: index,
                                                    key: key
                                                });
                                                console.log("Open window");
                                                setShowSpotChange(true);
                                            }
                                        }

                                    }}
                                    style={{
                                        cursor: "pointer", 
                                        backgroundColor: (
                                            parkingLot[index][key].status === ParkingStatuses.Open) ? "green" : 
                                                    (orders[parkingLot[index][key].guest.key]) ? 
                                                        (parkingLot[index][key].status === ParkingStatuses.Dirty || orders[parkingLot[index][key].guest.key].delivered) ? "grey" : 
                                                            (orders[parkingLot[index][key].guest.key].needsToOrder) ? "#3372e8" : 
                                                                (orders[parkingLot[index][key].guest.key].paid) ? "#705b1b" : "tan" 
                                                        : "tan", 
                                        border: "15px solid #ececec", 
                                        color: "white"
                                    }} 
                                    align="center" 
                                    size="medium"
                                    >
                                    {key}
                                </TableCell>
                                )
                            })
                        }
                    </TableRow>
                )
            })
        }
        </TableBody>
    
    </Table>
    );
}

const ConfirmDialog = ({show, handleClose, order, selectedSpace, selectedOrder, updateSpot}) => {

    return(
    <Dialog open={show} onClose={handleClose}>
        <DialogTitle>
            Please Confirm Spot Selection
        </DialogTitle>
        <DialogContent>
            Confirm spot {selectedSpace.key}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                Cancel
            </Button>
            <Button
                onClick={()=>{
                    console.log(selectedOrder)
                    updateSpot(selectedOrder, selectedSpace)
                    handleClose();
                }}
            >
                Confirm
            </Button>

        </DialogActions>
    </Dialog>
    )
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
const MissingGuestDialog = ({addOrder, show, handleClose}) => {
    const [status, setStatus] = useState("needsToOrder");
    const [check, setCheck] = useState({...emptyCheck});

    const [snack, setSnack] = useState(false);

    const handleSnack = () => {
        setSnack(!snack);
    }
    return(
        
        <Dialog open={show} onClose={handleClose}>
            <Snackbar open={snack} autoHideDuration={6000} onClose={handleSnack}>
                <Alert onClose={handleClose} severity="error">
                    You must enter a first name
                </Alert>
            </Snackbar>
            <DialogTitle>
                Adding missing guest
            </DialogTitle>
            <DialogContent>
                <MissingGuestForm setStatus={setStatus} check={check} setCheck={setCheck} />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={
                        ()=>{
                            console.log(status);
                            if(check.firstName === ""){
                                handleSnack();
                            } else {
                                const tempCheck = {...check};
                                tempCheck[status] = true;
                                if(tempCheck.farmersMarket) {
                                    tempCheck.bagged = true;
                                }
                                addOrder(tempCheck);
                                setCheck({...emptyCheck})
                                setStatus("needsToOrder")
                            }
                        }
                    }
                >
                    Add
                </Button>
                <Button
                    onClick={()=>{
                        setCheck({...emptyCheck});
                        handleClose();
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const MissingGuestForm = ({check, setCheck, setStatus}) => {
    
    const handleChange = (e, index) =>{
        const value = e.target.value;
        const tempCheck = check;
        tempCheck[index] = value;
        setCheck({...tempCheck});
    }
    const radioChange = (e) => {
        setStatus(e.target.value);
    }
    return(
            <form  noValidate autoComplete="off">
                <RadioGroup onChange={radioChange} defaultValue="needsToOrder" aria-label="missing" name="missing-guest">
                    <FormControlLabel value="needsToOrder" control={<Radio />} label="Needs to Order" />
                    <FormControlLabel value="farmersMarket" control={<Radio />} label="Farmer's Market" />
                    <FormControlLabel value="futureOrder" control={<Radio />} label="Future Order" />
                    <FormControlLabel value="rtgSteaks" control={<Radio />} label="Ready to Grill Steaks" />
                    <FormControlLabel value="needManager" control={<Radio />} label="Needs a Manager" />

                </RadioGroup>
    
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

        </form>
    )
}

export default GuestManage;
