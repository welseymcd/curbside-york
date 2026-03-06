import React, {useState, useEffect} from 'react';
import OrderTable from "./ordertable.js";
import { makeStyles } from '@material-ui/core/styles';

import { List, ListItem, ListItemText, AppBar,Drawer,  Toolbar, IconButton, Typography, Box, Collapse } from '@material-ui/core';
import GuestManage from './ParkingLot/agm';
import UserProfile from './Admin/user';
import ModifyParkingLot from "./ParkingLot/parkinglotsetup";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    useLocation,
    useRouteMatch
  } from "react-router-dom";
  import {AppContext, UserContext} from "../utils/appcontext";
import firebase, {logout} from "./firebase.js";
import moment from "moment"
import {SnackbarProvider} from 'notistack';

import MenuIcon from '@material-ui/icons/Menu';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {positions} from "../utils/consts";
import FarmersMarket, {FarmersMarketTotalsPage} from './farmersmarket.js';



const database = firebase.database();




const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

function Curbside() {
    // Top Level App States
    const [parkingLot, setParkingLot] = useState([]);
    const [orders, setOrders] = useState({});
    const [store, setStore] = useState(null);    
    const [title, setTitle] = useState("Positions");
    const [selectedPosition, setSelectedPosition] = useState(0);
    const [spotIndex, setSpotIndex] = useState({});


    const [openMenu, setOpenMenu] = useState(false);
    const date = moment();
    const {user} = React.useContext(UserContext);
    useEffect(()=>{
        if(store === null){
            database.ref("/settings/"+user.user.uid + "/").once("value").then((snapshot)=>{
                if(snapshot) {
                    if(snapshot.val()){
                        setStore(snapshot.val().store);
                    } else {
                        const defaultStore = "114";
                        database.ref("/settings/"+user.user.uid + "/").set({store: defaultStore});
                        setStore(defaultStore);
                    }
                }
            }).catch(() => {
                setStore("None");
            });
        }
    }, [])
    // Loads orders
    useEffect(()=>{
        if(store !== null){
            const orderRef = database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/");
            const unsubscribe = orderRef.on("value", function(snapshot){
                if(snapshot){
                    const tempOrders = snapshot.val()
                    setOrders({...tempOrders});
                }
            })
            return unsubscribe;
        }
    }, [store])
  
    // Loads the parking log
    useEffect(()=>{
    if(store !== null){
        const parkingLotRef = database.ref("/parkinglot/" + store);
        //parkingLotRef.set(sections);
        const unsubscribe = parkingLotRef.on("value", function(snapshot){
            if(snapshot){
                if(snapshot.val()){
                    var tempIndex = {};
                    var tempParkingLot = snapshot.val()
                    tempParkingLot = Object.keys(tempParkingLot).map((key)=>{
                        if(parkingLot.length === 0) {
                            Object.keys(tempParkingLot[key]).forEach((name)=>{
                                tempIndex[name] = {
                                    index: key,
                                    key: name
                                }
                            })
                        }
                        return tempParkingLot[key];
                    })
                    if(parkingLot.length === 0) {
                        setSpotIndex({...tempIndex});
                    }
                    setParkingLot([...tempParkingLot]);
                }
            }
        })
        return unsubscribe;
    }
    }, [store])
    useEffect(()=>{
        const localPosition = parseInt(sessionStorage.position);
        if(localPosition){
            setSelectedPosition(localPosition);
        }
    }, [])


    const handleMenu = () => {
        setOpenMenu(!openMenu);
    }

    return (
        <AppContext.Provider value={{orders, setOrders, parkingLot, setParkingLot, store, selectedPosition, setSelectedPosition, spotIndex}}>
        <SnackbarProvider maxSnack={2} dense>
            {store !== "None" ?           
            <Box >

            <Router>                
                <MenuBar title={title} handleMenu={handleMenu} />
                <Toolbar />
            <DrawerMenu open={openMenu} handleClose={handleMenu} />

              <Switch>
                <Route path="/traffic">
                  <GuestManage />
                </Route>
                <Route exact path="/">
                  <OrderTable />
                </Route>
                <Route path="/admin/parkinglot/modify">
                    <ModifyParkingLot />
                </Route>
                <Route exact path="/farmersmarket">
                    <FarmersMarket />
                </Route>
                <Route path="/farmersmarket/totals">
                    <FarmersMarketTotalsPage />
                </Route>
                <Route exact path="/admin/user">
                    <UserProfile />
                </Route>
                <Route path="/admin/user/:id" children={<UserProfile />} />
              </Switch>
            </Router>
          </Box>
        :
           "There is something wrong with your settings. Refresh. If error persists, call Ross."
        }
        </SnackbarProvider>
        </AppContext.Provider>
    );
  }

  const DrawerMenu = ({open, handleClose, setTitle}) => {
      const {setSelectedPosition} = React.useContext(AppContext);
      const [menuOpen, setMenuOpen] = useState(false);
      const history = useHistory();
      const classes = useStyles();
    return (
        <Drawer anchor="left" open={open} onClose={handleClose}>
            <List>
                <ListItem
                    button
                    onClick={()=>{
                        setMenuOpen(!menuOpen);
                    }}
                >
                    <ListItemText primary={"Curbside Inside Positions"}  />
                    {menuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            positions.map((position, index)=>{
                                return (
                                    <ListItem
                                        button
                                        key={index}
                                        className={classes.nested}
                                        onClick={()=>{
                                            history.push("/");
                                            setSelectedPosition(index);
                                            handleClose();
                                            setMenuOpen(false);

                                        }}
                                    >
                                        <ListItemText primary={position.title} />
                                    </ListItem>
                                );
                            })

                        }         
                    </List>
                </Collapse>
                <ListItem
                    button
                    onClick={()=>{
                        history.push("/traffic");
                        handleClose();
                    }}
                >
                    <ListItemText primary={"Traffic Control"} />
                </ListItem>
                <ListItem
                    button
                    onClick={()=>{
                        history.push("/traffic/updater");
                        handleClose();
                    }}
                >
                <ListItemText primary={"Update"} />
                </ListItem>
                <ListItem
                    button
                    onClick={()=>{
                        history.push("/admin/parkinglot/modify");
                        handleClose();
                    }}
                >
                    <ListItemText primary={"Modify Parking Lot"} />
                </ListItem>
                <ListItem
                    button
                    onClick={()=>{
                        history.push("/farmersmarket");
                        handleClose();
                    }}
                >
                    <ListItemText primary={"Farmer's Market"} />
                </ListItem>
                <ListItem
                    button
                    onClick={()=>{
                        history.push("/farmersmarket/totals");
                        handleClose();
                    }}
                >
                    <ListItemText primary={"Farmer's Market Totals"} />
                </ListItem>
                {
                <ListItem button
                    onClick={logout}
                >
                    <ListItemText primary={"Sign Out"} />
                </ListItem>
                }
            </List>
        </Drawer>
    )
}
const MenuBar = ({handleMenu}) => {
    const [title, setTitle] = useState("");
    const location = useLocation();
    useEffect(()=>{
        if(location.pathname === "/"){
            setTitle("Curbside Overview")
        } else if(location.pathname === "/traffic"){
            setTitle("Traffic Control")
        } else if(location.pathname === "/admin/parkinglot/modify") {
            setTitle("Modify Parking Lot Layout");
        } else {
            setTitle("Curbside Tool")
        }
    }, [location])
    return (
        <AppBar>
        <Toolbar>
            <IconButton
                        aria-label="options"
                        aria-controls="sideMenu"
                        onClick={handleMenu}
                    >
                        <MenuIcon style={{color: "white"}}  />
                    </IconButton>
            <Typography variant="h6" style={{color: "white"}}>
                {title}
            </Typography>

        </Toolbar>
    </AppBar>
    )
}

  export default Curbside;
