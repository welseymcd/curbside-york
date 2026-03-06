import React, { useState, useEffect } from "react";
import { Table, InputBase, TableRow, Grid, Button, AppBar, Toolbar, TableBody, IconButton, Typography, TableCell, Dialog, Container,
    DialogTitle, DialogContent, TextField, Fab, DialogActions, FormControlLabel, Checkbox, Box
} from "@material-ui/core";

import AppContext from "../../utils/appcontext";

const ParkingLotLayout = ({setSelectedSpace, handleClose, confirm}) =>{
    const {parkingLot, setParkingLot} = React.useContext(AppContext);
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
                                    console.log(tempParking[index])
                                    if(tempParking[index][key].status === ParkingStatuses.Dirty) {
                                        tempParking[index][key].status = ParkingStatuses.Open;
                                        setParkingLot([...tempParking]);
                                    } else if (tempParking[index][key].status === ParkingStatuses.Open){
                                        console.log({
                                            index: index,
                                            key: key
                                        });
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