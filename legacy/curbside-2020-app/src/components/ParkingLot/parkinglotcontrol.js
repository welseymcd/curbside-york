import React, { useState, useEffect, useContext} from "react";
import {AppContext} from "../../utils/appcontext";
import moment from "moment";

import {modifySpecificSpot, modifyOrders} from "../firebase";
import { Table, TableRow, Button, AppBar, Toolbar, TableBody, IconButton, Typography, TableCell, Dialog, Container,
    DialogTitle, DialogContent, DialogActions, Box
} from "@material-ui/core";
import {ParkingStatuses} from "./agm"
import CloseIcon from '@material-ui/icons/Close';

function SpotTransfer({show, setShow, selectedOldSpace}){
    const {store, parkingLot, orders} = useContext(AppContext);

    const [space, setSpace] = useState({})

    
    const [showSelection, setShowSelection] = useState(false);
    const [confirm, setConfirm] = useState(false);
    

    // Transfer varriables  
    const [transferLocation, setTransferLocation] = useState({
            index: "",
            key: ""
        });
    
    const handleConfirm = () => {
        setConfirm(!confirm);
    }

    const handleClose = () => {
        setShowSelection(!showSelection);
    }

    const handleOpenClick = (index, key) => {
        setTransferLocation({
            index: index,
            key: key
        })
        setConfirm(true);
        handleClose();
    }

    const saveChanges = () => {
        if(
            !selectedOldSpace ||
            selectedOldSpace.index === undefined ||
            !selectedOldSpace.key ||
            transferLocation.index === "" ||
            !transferLocation.key ||
            !parkingLot[selectedOldSpace.index] ||
            !parkingLot[selectedOldSpace.index][selectedOldSpace.key] ||
            !parkingLot[transferLocation.index] ||
            !parkingLot[transferLocation.index][transferLocation.key]
        ) {
            closeTransfer();
            return;
        }
        const spot = parkingLot[transferLocation.index][transferLocation.key];
        const space = parkingLot[selectedOldSpace.index][selectedOldSpace.key];
        spot.guest.key = space.guest.key;
        spot.status = ParkingStatuses.Sat;
        space.guest.key = "";
        space.status = ParkingStatuses.Open;
        modifySpecificSpot(store, spot, transferLocation.index, transferLocation.key)
            .then(()=>{
                console.log("Saveed");
                return modifySpecificSpot(store, space, selectedOldSpace.index, selectedOldSpace.key);
            })
            .then(()=>{
                console.log("Updated old spot");
                const orderKey = spot.guest && spot.guest.key;
                const tempOrder = orderKey ? orders[orderKey] : null;
                if(tempOrder){
                    console.log("Updating order");
                    tempOrder.spotNumber = transferLocation.key;
                    return modifyOrders(orderKey, tempOrder, store)
                        .then(()=>{
                            console.log("Updated order");
                        })
                        .catch(()=>{
                            console.log("Error updating order");
                        });
                }
                console.log("No matching order found for moved spot");
                return null;
            })
            .catch(()=>{
                console.log("Error updating spot transfer");
            });
        closeTransfer();
    }
    const closeTransfer = () => {
        setShowSelection(false);
        setConfirm(false);
        setShow(false);
    }

    useEffect(()=>{
        setShowSelection(show)
        if(
            parkingLot.length > 0 &&
            selectedOldSpace &&
            selectedOldSpace.index !== undefined &&
            selectedOldSpace.key &&
            parkingLot[selectedOldSpace.index] &&
            parkingLot[selectedOldSpace.index][selectedOldSpace.key]
        ){
            setSpace(parkingLot[selectedOldSpace.index][selectedOldSpace.key]);
        } else {
            setSpace({});
        }
    }, [show]);

    return(
        <Box>
            <ConfirmDialog show={confirm} handleClose={closeTransfer} updateSpot={saveChanges} selectedSpace={transferLocation} />
            <Dialog fullScreen open={showSelection} onClose={closeTransfer}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={closeTransfer} aria-label="close">
                    <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" style={{color: "white"}}>
                    Spot Selection
                    </Typography>

                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
                <ParkingLotLayoutDefault openClick={handleOpenClick} />
            </Container>
            </Dialog>
        </Box>

    );
}


const ConfirmDialog = ({show, handleClose, order, selectedSpace, selectedOrder, updateSpot}) => {
    if(selectedSpace) {
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
                            updateSpot()
                            handleClose();
                        }}
                    >
                        Confirm
                    </Button>
        
                </DialogActions>
            </Dialog>
            )
    } else {
        return null;
    }

}

export const Updater = () => {
    const {store, parkingLot, orders} = useContext(AppContext);

    const [selectedSpot, setSelectedSpot] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState();

    // Transfer Dialog
    const [spotDetail, setSpotDetail] = useState(false);
    const [spotTransfer, setSpotTransfer] = useState(false);

    const handleSpotDetail = () => {
        setSpotDetail(!spotDetail);
    }

    const openClick = (index, key) =>{
        setSelectedSpot({
            index: index,
            key: key
        });
        handleSpotDetail();
    }
    const deliveredClick = (index, key) =>{
        setSelectedSpot({
            index: index,
            key: key
        });
        handleSpotDetail();
    }
    const satClick = (index, key) =>{
        setSelectedSpot({
            index: index,
            key: key
        });
        handleSpotDetail();
    }

    const handleTransfer = () => {
        setSpotTransfer(true);
    }

    const handleOpen = () => {
        var tempSpot = parkingLot[selectedSpot.index][selectedSpot.key];
        tempSpot.status = ParkingStatuses.Open;
        tempSpot.guest.key = "";
        modifySpecificSpot(store, tempSpot, selectedSpot.index, selectedSpot.key);
        handleSpotDetail();
    }

    const handleDelivered = () => {
        var tempSpot = parkingLot[selectedSpot.index][selectedSpot.key];
        tempSpot.status = ParkingStatuses.Dirty;
        modifySpecificSpot(store, tempSpot, selectedSpot.index, selectedSpot.key);
        handleSpotDetail();
    }
    
    return (
        <Box>
            <SpotDetailDialog show={spotDetail} transfer={handleTransfer} handleClose={handleSpotDetail} delivered={handleDelivered} open={handleOpen} selectedSpot={selectedSpot} />
            <SpotTransfer show={spotTransfer} setShow={setSpotTransfer} selectedOldSpace={selectedSpot} />
            <ParkingLotLayoutDefault openClick={openClick} deliveredClick={deliveredClick} satClick={satClick} />
        </Box>
    )
}

export const UpdaterDialog = ({show, setShow}) => {

    const handleClose = () => {
        setShow(!show);
    }

    return(
        <Dialog fullScreen open={show} onClose={handleClose}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" style={{color: "white"}}>
                        Updater
                    </Typography>

                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
                <Updater />
            </Container>
        </Dialog>
    )
}

const SpotDetailDialog = ({setShowSpot, open, transfer, delivered, updateParkingSpot, show, handleClose, selectedSpot}) => {
    const {parkingLot, orders, store} = useContext(AppContext);

    if(!selectedSpot){
        return null
    } else {
        if(parkingLot[selectedSpot.index][selectedSpot.key].status === ParkingStatuses.Open){
            return(
                <Dialog open={show} onClose={handleClose}>
                    <DialogTitle>Spot {parkingLot[selectedSpot.index][selectedSpot.key].label}</DialogTitle>
                    <DialogContent>
                        Current spot is open, would you like to mark it "Delivered"?
                    </DialogContent>
                    <DialogActions>
                        <Button
                                onClick={()=>{
                                        delivered();
                                        handleClose();  
                                }}
                            >
                                Delivered
                        </Button>
                        <Button
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else if((orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key])) {
            return(
                <Dialog open={show} onClose={handleClose}>
                    <DialogTitle>Spot {parkingLot[selectedSpot.index][selectedSpot.key].label}</DialogTitle>
                    <DialogContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Name: 
                                    </TableCell>
                                    <TableCell>
                                        {orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].firstName + " " + orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].lastName}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Check Number: 
                                    </TableCell>
                                    <TableCell>
                                        {(orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key]) ? orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].checkNumber : null} 
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Arrival Time: 
                                    </TableCell>
                                    <TableCell>
                                        {(orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key]) ? moment(orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].arrivalTime).format("hh:mm a") : null}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        {
                            (orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key]) ? 
                                (parkingLot[selectedSpot.index][selectedSpot.key].status === ParkingStatuses.Sat && orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].delivered === false) ? 
                                    <Button onClick={()=>{
                                        transfer();
                                        handleClose();
                                    }}>
                                        Transfer
                                    </Button> 
                                : null
                            : null
                        }
                        <Button
                            onClick={()=>{
                                if(orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key]) {
                                    if(orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].delivered || parkingLot[selectedSpot.index][selectedSpot.key].status === ParkingStatuses.Dirty) {
                                        open();
                                    } else {
                                        delivered();
                                    }
                                } else {
                                    open();
                                }
                                handleClose();  
                            }}
                            >                            
                            {(orders) ? (orders[parkingLot[selectedSpot.index][selectedSpot.key].guest.key].delivered === true || parkingLot[selectedSpot.index][selectedSpot.key].status === ParkingStatuses.Dirty) ? "Open" : "Delivered" : null}
                        </Button>
                        <Button
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        } else {
            return (
                <Dialog open={show} onClose={handleClose}>
                    <DialogTitle>Spot {parkingLot[selectedSpot.index][selectedSpot.key].label}</DialogTitle>
                    <DialogContent>
                        The order at this spot not longer exists. Please mark it open.
                    </DialogContent>
                    <DialogActions>
                        <Button
                                onClick={()=>{
                                        open();
                                        handleClose();  
                                }}
                            >
                                Open
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        }
    }
}

export const ParkingLotLayoutDefault = ({openClick, deliveredClick, satClick}) =>{
    const {parkingLot, orders} = useContext(AppContext);
    const handleOpen = (index, key) =>{
        if(openClick) {
            openClick(index, key);
        }
    }
    const handleDelivered = (index, key) =>{
        if(deliveredClick) {
            openClick(index, key);
        }
    }
    const handleSat = (index, key) =>{
        if(satClick) {
            openClick(index, key);
        }
    }
    const chooseColor = (index, key) => {
        if(orders[parkingLot[index][key].guest.key]){
            const order = orders[parkingLot[index][key].guest.key];
            if(parkingLot[index][key].status === ParkingStatuses.Open) {
                return "green"
            } else if(parkingLot[index][key].status === ParkingStatuses.Dirty || order.delivered){
                return "grey"
            } else if(parkingLot[index][key].status === ParkingStatuses.Sat) {
                if(order.needManager){
                    return "red"
                } else {
                    return "tan"
                }
            }
        } else {
            if(parkingLot[index][key].status === ParkingStatuses.Open) {
                return "green"
            } else if(parkingLot[index][key].status === ParkingStatuses.Dirty){
                return "grey"
            } else if(parkingLot[index][key].status === ParkingStatuses.Sat) {
                return "tan"
            }
        }
    }
    return(
        <Table>
            <TableBody>
                {parkingLot.map((section, index)=>{
                    return (
                    <TableRow key={index}>
                        {
                            Object.keys(section).map((key)=>{
                            return (
                                <TableCell 
                                    key={key}
                                    onClick={()=>{
                                        const currentSpot = parkingLot[index][key];
                                        if(orders[currentSpot.guest.key]){
                                            const currentOrder = orders[currentSpot.guest.key];
                                            if(parkingLot[index][key].status === ParkingStatuses.Open){
                                                handleOpen(index, key);
                                            } else if(parkingLot[index][key].status === ParkingStatuses.Dirty || currentOrder.delivered === true) {
                                                handleDelivered(index, key);
                                            } else if (parkingLot[index][key].status === ParkingStatuses.Sat) {
                                                handleSat(index, key)
                                            }
                                        } else {
                                            if(parkingLot[index][key].status === ParkingStatuses.Dirty) {
                                                handleDelivered(index, key);
                                            } else if (parkingLot[index][key].status === ParkingStatuses.Open){
                                                handleOpen(index, key);
                                            } else if (parkingLot[index][key].status === ParkingStatuses.Sat) {
                                                handleSat(index, key)
                                            }
                                        }
                                    }}
                                    style={{cursor: "pointer", backgroundColor: chooseColor(index, key), border: "15px solid #ececec", color: "white"}} align="center" size="medium">
                                    {key}
                                    <br />
                                    {(orders[parkingLot[index][key].guest.key]) ?
                                        (!orders[parkingLot[index][key].guest.key].delivered && parkingLot[index][key].status === ParkingStatuses.Sat) ?
                                            moment(orders[parkingLot[index][key].guest.key].arrivalTime).format("hh:mm a")
                                            :
                                            null
                                        :null
                                    
                                    }
                                </TableCell>
                                )
                            })
                    }
                    </TableRow>)

                })}
            </TableBody>
        </Table>
    )
}



export default SpotTransfer;
