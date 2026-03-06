import React, { useEffect, useState } from "react";
import moment from "moment"


import {AppContext} from "../utils/appcontext";
import { Paper, Grid, Card, DialogTitle, Container, CardContent, Typography, TextField, IconButton, Button, DialogContent, DialogActions, Dialog, Toolbar, Menu, MenuItem } from "@material-ui/core";
import {SearchBox} from "./ordertable";
import firebase, {modifyOrders} from "./firebase.js";
import useStyles from "../utils/styles";
import {prices} from "../utils/consts";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FilterListIcon from '@material-ui/icons/FilterList';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';


const database = firebase.database();

const sortOptions = [
    "All",
    "Here",
    "Not Picked Up",
    "Delivered"
]
const FarmersMarket = ({}) => {
    // Instantiate States
    const [modifyOrder, setModifyOrder] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentSort, setCurrentSort] = React.useState(0);
    const [searchIndex, setSearchIndex] = useState("name");
    const [searchText, setSearchText] = useState("");

    // Show States
    const [showModify, setShowModify] = React.useState(false);
    const [showPayment, setShowPayment] = React.useState(false);
    const [showPickedUp, setShowPickedUp] = React.useState(false);


    const modify = (orderId) => {
        console.log(orderId);
        setModifyOrder(orderId);
        setShowModify(true);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handlePayClose = () => {
        setShowPayment(!showPayment);
    }

    const handlePickedUpClose = () => {
        setShowPickedUp(!showPickedUp);
    }


    const handleClose = () => {
        setAnchorEl(null);
    }
    const pay = (orderId) =>{
        setModifyOrder(orderId);
        setShowPayment(true);
    }
    const pickup = (orderId) =>{
        setModifyOrder(orderId);
        setShowPickedUp(true);
    }
    /*
    useEffect(()=>{
        const date = moment();
        const store = "114";
        forders.forEach((order)=>{
            database.ref("/checks/" + date.format("MM-DD-YYYY") + "/" + store + "/").push(order);
        })
    }, []) */
    return(
        <Container style={{paddingTop: "12px"}}>
            <ModifyFarmersMarket show={showModify} setShow={setShowModify} orderId={modifyOrder} />
            <PayDialog show={showPayment} setShow={setShowPayment} orderId={modifyOrder} handleClose={handlePayClose} />
            <PickedUpDialog show={showPickedUp} orderId={modifyOrder} handleClose={handlePickedUpClose} />
            <Header />
            <Toolbar>
                <Button onClick={handleClick}><FilterListIcon /> {sortOptions[currentSort]}</Button>
                <SearchBox searchIndex={searchIndex} setSearchIndex={setSearchIndex} searchText={searchText} setSearchText={setSearchText} />
            </Toolbar>
            <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={()=>{
                        setCurrentSort(0);
                        handleClose();
                    }}
                >All</MenuItem>
                <MenuItem                    
                    onClick={()=>{
                        setCurrentSort(1);
                        handleClose();
                    }}>Here</MenuItem>
                <MenuItem
                    onClick={()=>{
                        setCurrentSort(2);
                        handleClose();
                    }}
                >Not Picked Up</MenuItem>
                <MenuItem
                    onClick={()=>{
                        setCurrentSort(3);
                        handleClose();
                    }}
                >Delivered</MenuItem>
            </Menu>
            <FarmersOrderTable searchIndex={searchIndex} searchText={searchText} currentFilter={currentSort} pay={pay} modify={modify} pickup={pickup} />

        </Container>
    )
}

const Header = ({}) => {

    const [total, setTotal] = useState(0);
    const [pickedUpTotal, setPickedUpTotal] = useState(0);
    const [addOnTotal, setAddOnTotal] = useState(0);
    const [boxTotal, setBoxTotal] = useState(0);
    const [cashTotal, setCashTotal] = useState(0);
    const [cardTotal, setCardTotal] = useState(0);
    const {orders} = React.useContext(AppContext);
    useEffect(()=>{
        var tempTotal=0;
        var tempPickedUpTotal = 0;
        var tempAddOnTotal = 0;
        var tempBoxTotal = 0;
        var tempCashTotal = 0;
        var tempCardTotal = 0;
        Object.keys(orders)
        .filter((key)=>{
            const order = orders[key];
            return order.farmersMarket && !order.deleted
        })
        .forEach((key)=>{
            const order = orders[key];
            var orderAddOnTotal = order.condimentPack * prices.condimentPack + order.peanuts * prices.peanuts + order.sweetTea * prices.sweetTea + order.unsweetTea * prices.unsweetTea + order.lemonade * prices.lemonade + prices.fountainDrink * order.fountainDrink;
            var orderTotal = order.boxes * prices.boxes + order.seafoodPack * prices.seafoodPack + order.ribeyePack * prices.seafoodPack + orderAddOnTotal;
            tempBoxTotal +=  order.boxes * prices.boxes 
            tempAddOnTotal += orderAddOnTotal;
            if(order.delivered) {
                tempPickedUpTotal += orderTotal
            }
            if(order.paid && order.delivered){
                if(order.payment === "Cash") {
                    tempCashTotal += orderTotal;
                } else if(order.payment === "Card") {
                    tempCardTotal += orderTotal;
                }
            }
            tempTotal += orderTotal;
        });
        setTotal(tempTotal);
        setAddOnTotal(tempAddOnTotal);
        setPickedUpTotal(tempPickedUpTotal);
        setBoxTotal(tempBoxTotal);
        setCashTotal(tempCashTotal);
        setCardTotal(tempCardTotal);
    }, [orders])
    return (
        <Grid container spacing={4}>
            <Grid item xs={3}> 
                <Card>
                    <CardContent>
                        <Typography>
                            All Sales
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {total.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}> 
                <Card>
                    <CardContent>
                        <Typography>
                            Picked Up Sales
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {pickedUpTotal.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}> 
                <Card>
                    <CardContent>
                        <Typography>
                            Cash Payment Totals
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {cashTotal.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}> 
                <Card>
                    <CardContent>
                        <Typography>
                            Card Payment Totals
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {cardTotal.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export const FarmersMarketTotalsPage = ({}) => {
    const {orders} = React.useContext(AppContext);

    const [total, setTotal] = useState(0);
    const [pickedUpTotal, setPickedUpTotal] = useState(0);
    const [addOnTotal, setAddOnTotal] = useState(0);
    const [boxTotal, setBoxTotal] = useState(0);
    const [peanutCount, setPeanutCout] = useState(0);
    const [lemonadeCount, setLemonadeCount] = useState(0);
    const [sweetTeaCount, setSweetTeaCount] = useState(0);
    const [unsweetTeaCount, setUnsweetTeaCount] = useState(0);



    useEffect(()=>{
        var tempTotal=0;
        var tempPickedUpTotal = 0;
        var tempAddOnTotal = 0;
        var tempBoxTotal = 0;
        var tempPeanutCount = 0;
        var tempLemonadeCount = 0;
        var tempSweetTeaCount = 0;
        var tempUnsweetTeaCount = 0;
        Object.keys(orders)
        .filter((key)=>{
            const order = orders[key];
            return order.farmersMarket && !order.deleted
        })
        .forEach((key)=>{
            const order = orders[key];
            var orderAddOnTotal = order.condimentPack * prices.condimentPack + order.peanuts * prices.peanuts + order.sweetTea * prices.sweetTea + order.unsweetTea * prices.unsweetTea + order.lemonade * prices.lemonade + prices.fountainDrink * order.fountainDrink;
            var orderTotal = order.boxes * prices.boxes + order.seafoodPack * prices.seafoodPack + order.ribeyePack * prices.seafoodPack + orderAddOnTotal;
            tempBoxTotal +=  order.boxes * prices.boxes 
            tempAddOnTotal += orderAddOnTotal;
            if(order.delivered) {
                tempPickedUpTotal += orderTotal
            }
            tempTotal += orderTotal;
            tempPeanutCount += order.peanuts;
            tempLemonadeCount += order.lemonade;
            tempSweetTeaCount += order.sweetTea;
            tempUnsweetTeaCount += order.unsweetTea;
        });
        setTotal(tempTotal);
        setAddOnTotal(tempAddOnTotal);
        setPickedUpTotal(tempPickedUpTotal);
        setBoxTotal(tempBoxTotal);
        setPeanutCout(tempPeanutCount);
        setSweetTeaCount(tempSweetTeaCount);
        setUnsweetTeaCount(tempUnsweetTeaCount);
        setLemonadeCount(tempLemonadeCount);
    }, [orders])
    return(
        <Container style={{paddingTop: "12px"}}>
            <Grid container spacing={4}>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                All Sales
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {total.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Picked Up Sales
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {pickedUpTotal.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Box Sales
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {boxTotal.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Add On Sales
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {addOnTotal.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Peanut Count
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {peanutCount.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Lemonade Count
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {lemonadeCount.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Sweet Tea Count
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {sweetTeaCount.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}> 
                    <Card>
                        <CardContent>
                            <Typography>
                                Unsweet Tea Count
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {unsweetTeaCount.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>

    )
}

// Order Table Elements
const FarmersOrderTable = ({modify, pay, pickup, currentFilter, searchIndex, searchText}) => {
    const {orders} = React.useContext(AppContext);
    const search = (order) => {
        if(searchText === "") {
            return true;
        } else {
            let searchString = searchIndex === "name" ? (order.firstName + " " + order.lastName) : order[searchIndex].toString();
            return (searchString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        }
    }
    return(
        <Grid container>
            <HeaderRow />
            {
                Object.keys(orders)
                .filter((key)=>{
                    const order = orders[key];
                    if(order.farmersMarket) {
                        if(currentFilter === 0){
                            return search(order) && !order.deleted
                        } else if(currentFilter === 1) {
                            return search(order) && order.arrived && !order.delivered && !order.deleted
                        } else if(currentFilter === 2) {
                            return search(order) && !order.delivered && !order.deleted
                        } else if(currentFilter === 3) {
                            return search(order) && order.delivered && !order.deleted
                        }
                    } else {
                        return false;
                    }
                    return order.farmersMarket
                })
                .map((key, index)=>{
                    const order = orders[key];
                    return (
                        <OrderRow key={key} index={index} order={order} pickup={pickup} orderId={key} modify={modify} pay={pay} />
                    )
                })
            }
        </Grid>
    );
}
const PayDialog = ({show, setShow, orderId, handleClose}) => {
    const {orders, store} = React.useContext(AppContext)
    const updateOrder = (status) => {
        const order = {...orders[orderId]};
        order.paid = true;
        order["payment"] = status;
        modifyOrders(orderId, order, store);
    }
    return(
        <Dialog open={show} onClose={handleClose}>
        <DialogTitle>
                Please choose a payment type
            </DialogTitle>
            <DialogContent>
                Did they use cash or a card?
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={()=>{
                        updateOrder("Cash")
                        handleClose();
                    }}
                >
                    Cash
                </Button>
                <Button
                    color="primary"
                    onClick={()=>{
                        updateOrder("Card");
                        handleClose();
                    }}
                >
                    Card
                </Button>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
const PickedUpDialog = ({show, orderId, handleClose}) => {
    const {orders, store} = React.useContext(AppContext)
    const updateOrder = () => {
        const order = {...orders[orderId]};
        order.delivered = !order.delivered;
        modifyOrders(orderId, order, store);
    }
    if(orders[orderId]){
        return(
            <Dialog open={show} onClose={handleClose}>
            <DialogTitle>
                    Mark {orders[orderId].firstName + " " + orders[orderId].lastName} {(!orders[orderId].delivered) ? "picked up" : "pick up"}
                </DialogTitle>
                <DialogContent>
                    Are you sure you would like to mark {orders[orderId].firstName + " " + orders[orderId].lastName}  {(!orders[orderId].delivered) ? "picked up" : "pick up"} this order?
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={()=>{
                            updateOrder();
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
    } else {
        return null;
    }
}
const HeaderRow = () =>{
    return(
    <Grid container item xs={12}>
        <Grid item xs={1}>
            <Typography>
                Car
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Name
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Order Total
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Delivered
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Paid
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Ribeye
            </Typography>
        </Grid>
        <Grid item xs={1}>
                <Typography>
                    Seafood
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    Condiment
                </Typography>
            </Grid>
        <Grid item xs={1}>
            <Typography>
                peanuts
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Sweet Tea
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Unsweet Tea
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Typography>
                Lemonade
            </Typography>
        </Grid>
    </Grid>
    );
}

const OrderRow = ({order, index, orderId, modify, pickup, pay}) =>{
    const [orderTotalState, setOrderTotalState] = useState(0);

    useEffect(()=>{
        var orderAddOnTotal = order.condimentPack * prices.condimentPack + order.peanuts * prices.peanuts + order.sweetTea * prices.sweetTea + order.unsweetTea * prices.unsweetTea + order.lemonade * prices.lemonade + prices.fountainDrink * order.fountainDrink;
        var orderTotal = order.boxes * prices.boxes + order.seafoodPack * prices.seafoodPack + order.ribeyePack * prices.seafoodPack + orderAddOnTotal;
        setOrderTotalState(orderTotal);
    }, [order])
    return(
        <Grid style={{backgroundColor: index % 2 === 1 ? "#DCDCDC" : "white", paddingTop: "2px", paddingBottom: "2px"}} container item xs={12}>
            <Grid item xs={1}>
                {order.spotNumber}
            </Grid>
            <Grid item xs={1}>
            <Button 
                    size="small"
                    onClick={
                        ()=>{
                            modify(orderId);
                        }
                    }
                >
                    {order.firstName + " " + order.lastName}
                </Button>
            </Grid>
            <Grid item xs={1}>
                    {orderTotalState.toFixed(2)}
            </Grid>
            <Grid item xs={1}>
                <Button
                    size="small"
                    onClick={()=>{
                        pickup(orderId);
                    }}
                >
                    {(order.delivered) ? "Picked Up" : "Pick Up"}
                </Button>
            </Grid>
            <Grid item xs={1}>
                <Button
                    size="small"
                    onClick={()=>{
                        pay(orderId)
                    }}
                >
                    {(!order.paid) ? "Pay" : (order["payment"]) ? order["payment"] : "Paid"  }   
                </Button>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    {order.ribeyePack}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    {order.seafoodPack}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    {order.condimentPack}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    {order.peanuts}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                    {order.sweetTea}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                {order.unsweetTea}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography>
                {order.lemonade}
                </Typography>
            </Grid>
        </Grid>
    )
}

const ModifyFarmersMarket = ({show, setShow, orderId}) => {
    const {orders} = React.useContext(AppContext)
    const [check, setCheck] = React.useState({})
    const handleClose = () => {
        setShow(!show);
    }
    useEffect(()=>{
        setCheck({... orders[orderId]});
    }, [show]);

    return (
        <ModifyForm show={show} handleClose={handleClose} check={check} setCheck={setCheck} orderId={orderId} />  
    )
}
const ModifyForm = ({show, handleClose, check, setCheck, orderId}) =>{
    {
        const {store} = React.useContext(AppContext);
        const [orderTotal, setOrderTotal] = React.useState(0);
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
            modifyOrders(orderId, check, store).then(()=>{
                console.log("Submitted")
            })
            setCheck(null);
            handleClose();
        }
        const deleteSubmit = () => {
            const tempCheck = {... check};
            tempCheck.deleted = !tempCheck.deleted;
            modifyOrders(orderId, tempCheck, store).then(()=>{
                console.log("Submitted")
            })
            handleClose();
        }
        useEffect(()=>{
            if(check){
                var orderAddOnTotal = check.condimentPack * prices.condimentPack + check.peanuts * prices.peanuts + check.sweetTea * prices.sweetTea + check.unsweetTea * prices.unsweetTea + check.lemonade * prices.lemonade + prices.fountainDrink * check.fountainDrink;
                var tempOrderTotal = check.boxes * prices.boxes + check.seafoodPack * prices.seafoodPack + check.ribeyePack * prices.seafoodPack + orderAddOnTotal;                
                setOrderTotal(tempOrderTotal)
            } else {
                setOrderTotal(0)
            }

        }, [check])
        if(check){
        return(
            <Dialog open={show} onClose={handleClose}>
                <DialogContent>
                    Please fill out all information for the Check
                </DialogContent>
                <DialogContent>
                    <form autoComplete="off">
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
                    <Grid container style={{textAlign: 'center'}}> 
                        <Grid container item xs={12} alignItems="center" justify="center" >
                            <Typography variant="h6" component="h6">Order Total: ${orderTotal.toFixed(2)}</Typography>
                        </Grid>
                    <Grid container item xs={12} alignItems="center" justify="center" >
                            <Grid item xs={3} >
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        if(tempCheck.ribeyePack > 0){
                                            tempCheck.ribeyePack -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3}>
                                Ribeye Pack:  
                            </Grid>
                            <Grid item xs={3}>
                                {check.ribeyePack}
                            </Grid>
                            <Grid item xs={3}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.ribeyePack += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} alignItems="center" justify="center" >
                            <Grid item xs={3} >
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        if(tempCheck.seafoodPack > 0){
                                            tempCheck.seafoodPack -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3}>
                                Seafood Pack:  
                            </Grid>
                            <Grid item xs={3}>
                                {check.seafoodPack}
                            </Grid>
                            <Grid item xs={3}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.seafoodPack += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} alignItems="center" justify="center" >
                            <Grid item xs={3} >
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        if(tempCheck.condimentPack > 0){
                                            tempCheck.condimentPack -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3}>
                                Condiment Pack:  
                            </Grid>
                            <Grid item xs={3}>
                                {check.condimentPack}
                            </Grid>
                            <Grid item xs={3}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.condimentPack += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} style={{margin: "auto"}}>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        if(tempCheck.peanuts > 0){
                                            tempCheck.peanuts -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                Peanuts:
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                {check.peanuts}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.peanuts += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} style={{margin: "auto"}}>
                            <Grid item xs={3} style={{margin: "auto"}}>
                            <IconButton
                                onClick={()=>{
                                    const tempCheck = {...check}

                                    if(tempCheck.lemonade > 0){
                                        tempCheck.lemonade -= 1;
                                        setCheck(tempCheck);
                                    }
                                }}
                            ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                Lemonade: 
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                {check.lemonade}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.lemonade += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} style={{margin: "auto"}}>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}

                                        if(tempCheck.sweetTea > 0){
                                            tempCheck.sweetTea -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                Sweet Tea:  
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                {check.sweetTea}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.sweetTea += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} style={{margin: "auto"}}>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}

                                        if(tempCheck.unsweetTea > 0){
                                            tempCheck.unsweetTea -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                Unsweet Tea: 
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                {check.unsweetTea}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.unsweetTea += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} style={{margin: "auto"}}>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}

                                        if(tempCheck.fountainDrink > 0){
                                            tempCheck.fountainDrink -= 1;
                                            setCheck(tempCheck);
                                        }
                                    }}
                                ><RemoveCircleOutlineIcon /></IconButton>
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                Fountain Drink: 
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                {check.fountainDrink}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <IconButton
                                    onClick={()=>{
                                        const tempCheck = {...check}
                                        tempCheck.fountainDrink += 1;
                                        setCheck(tempCheck);
                                    }}
                                ><AddCircleOutlineIcon /></IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    </form>
                </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">Cancel</Button>
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
export default FarmersMarket;