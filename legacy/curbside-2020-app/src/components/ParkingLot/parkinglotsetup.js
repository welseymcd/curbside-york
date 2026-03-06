import React from "react";
import { Table, InputBase, TableRow, Grid, Button, AppBar, Toolbar, TableBody, IconButton, Typography, TableCell, Dialog, Container,
    DialogTitle, DialogContent, TableHead,  ListItem, ListItemText, Drawer, List, TextField, Fab, DialogActions, FormControlLabel, Checkbox, Box, DialogContentText
} from "@material-ui/core";

import firebase, {modifyParkingLot} from "../firebase";
import {AppContext, UserContext} from "../../utils/appcontext";

const ParkingStatuses = {
    Open: "open",
    Dirty: "dirty",
    Sat: "sat"
}

const ModifyParkingLot = ({}) => {
    const {store, parkingLot} = React.useContext(AppContext);

    const [showAddRow, setShowAddRow] = React.useState(false);
    const [showRemoveRow, setShowRemoveRow] = React.useState(false);

    const handleAddRow = () =>{
        setShowAddRow(!showAddRow);
    }
    const handleRemoveRow = () => {
        setShowRemoveRow(!showRemoveRow)
    }

    const addRow = (columnCount, startingNumber, insertPoint) => {
        const spot = {
            label: "NA",
            status: ParkingStatuses.Open,
            guest: {
                name: "None",
                orderNumber: "000",
                needsToOrder: false,
                readyToGrill: false,
            }}
        const spots = {};
        var spotNumber = startingNumber;
        for(var i=0; i < columnCount; i++){
            const stringIndex = String(spotNumber);
            spots[stringIndex] = {
                label: stringIndex,
                status: ParkingStatuses.Open,
                guest: {
                    name: "None",
                    orderNumber: "000",
                    needsToOrder: false,
                    readyToGrill: false,
                }}
            spotNumber++;
        }
        const tempParkingLot = parkingLot;
        console.log(spots);
        if(insertPoint){
            tempParkingLot.splice(insertPoint-1, 0, spots);
        } else {
            tempParkingLot.push(spots);
        }
        modifyParkingLot(tempParkingLot, store);
    }

    const removeRow = (row) => {
        var tempParking = parkingLot;
        tempParking.splice(row, 1);
        modifyParkingLot(tempParking, store);
    }

    return(
        <Container style={{marginTop: "4px"}}>
            <AddRowDialog show={showAddRow} handleClose={handleAddRow} submit={addRow} />
            <RemoveRowDialog show={showRemoveRow} handleClose={handleRemoveRow} remove={removeRow} />
            <Button
                onClick={()=>{
                    handleAddRow();
                }}
            >
                Add Row
            </Button>
            <Button
                onClick={()=>{
                    handleRemoveRow();
                }}
            >
                Remove Row
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Row
                        </TableCell>
                        <TableCell>
                            Spot Count
                        </TableCell>
                        <TableCell>
                            Starting Spot
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parkingLot.map((section, index)=>{
                        return(
                            <TableRow>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {Object.keys(section).length}
                                </TableCell>
                                <TableCell>
                                    {Object.keys(section)[0]}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <br />
            <ParkingLotLayout />
        </Container>
    )
}

const AddRowDialog = ({show, submit, handleClose}) => {
    const [start, setStart] = React.useState("");
    const [spotCount, setSpotCount] = React.useState("");
    const [rowNumber, setRowNumber] = React.useState("");

    const handleStartChange = (e) => {
        setStart(e.target.value);
    }
    const handleSpotsChange = (e) => {
        setSpotCount(e.target.value);
    }
    const handleRowNumberChange = (e) => {
        setRowNumber(e.target.value)
    }

    return(
        <Dialog open={show} onClose={handleClose} fullWidth={true}>
            <DialogTitle>
                Fill out the following information.
            </DialogTitle>
            <DialogContent>
            <form  noValidate autoComplete="off">
                <TextField
                    id="start"
                    label="Enter Starting Spot Number (Example: 101)"
                    value={start}
                    onChange={handleStartChange}
                    fullWidth
                />
                <br />
                <TextField
                
                    id="spots"
                    label="Enter the amount of spots"
                    value={spotCount}
                    onChange={handleSpotsChange}
                    fullWidth
                />
                <br />
                <TextField
                
                    id="row"
                    label="Enter the row location (Leave blank for last row)"
                    value={rowNumber}
                    onChange={handleRowNumberChange}
                    fullWidth
                />
                <br />
            </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={()=>{
                        if(rowNumber === ""){
                            submit(parseInt(spotCount), parseInt(start))
                        } else {
                            submit(parseInt(spotCount), parseInt(start), parseInt(rowNumber))
                        }
                        setRowNumber("");
                        setSpotCount("");
                        setStart("");
                        handleClose();
                    }}
                    >
                        Add Row
                    </Button>
                    <Button
                        onClick={()=>{
                            handleClose();
                        }}
                    >
                        Cancel
                    </Button>
            </DialogActions>
        </Dialog>
    )
}
const RemoveRowDialog = ({show, remove, handleClose}) => {
    const [removeValue, setRemoveValue] = React.useState("")
    const handleChange = (e) => {
        setRemoveValue(e.target.value)
    }
    return(
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle>
                Enter Row to Delete
            </DialogTitle>
            <DialogContent>
                Please enter the row you would like to remove
            <TextField
                    id="firstName"
                    label="Row to Remove"
                    value={removeValue}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={()=>{
                        console.log(parseInt(removeValue))
                        remove(parseInt(removeValue) - 1);
                        handleClose();
                    }}
                    >
                        Remove Row
                    </Button>
                    <Button
                        onClick={()=>{
                            handleClose();
                        }}
                    >

                    </Button>
            </DialogActions>
        </Dialog>
    )
}


const ParkingLotLayout = ({}) =>{
    const {parkingLot} = React.useContext(AppContext);
    return(
    <Table>
    <TableBody>

    {
        parkingLot.map((section, index)=>{
            return (
                <TableRow>
                    {
                        Object.keys(section).map((key)=>{
                            return (
                           <TableCell
                                style={{cursor: "pointer", backgroundColor:  "green", border: "15px solid #ececec", color: "white"}} align="center" size="medium">
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

export default ModifyParkingLot;