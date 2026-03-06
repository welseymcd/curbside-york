import React, { useState, useEffect } from "react";
import { Table, TableRow, Grid, Button, AppBar, Toolbar, TableBody, IconButton, Typography, TableCell, Dialog, Container,
    DialogTitle, DialogContent, DialogActions
} from "@material-ui/core";
import firebase from "../firebase.js";
import moment from "moment";
import {ParkingStatuses, ParkingLotView} from "./agm"

import CloseIcon from '@material-ui/icons/Close';


const Updater = ({parkingLot, setParkingLot, orders, setOrders}) => {
    return(
        <ParkingLotView parkingLot={parkingLot} setParkingLot={setParkingLot} />
    )
}

const UndoMenu = ({})

