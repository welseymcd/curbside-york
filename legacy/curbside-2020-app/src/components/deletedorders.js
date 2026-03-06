import {Grid, Hidden, Box} from '@material-ui/core';
import React from 'react';
import AppContext from "../utils/appContext";

const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      [theme.breakpoints.up('xs')]: {
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


const DeleteTable = ({})=>{
    const {Orders} = React.useContext(AppContext);

    return(
        <Box>
            <Grid container>
                <HeaderRow />
                {
                    Orders.filter((order)=>{
                        return (order.deleted);
                    }).map((order)=>{
                        return(
                            <OrderRow order={order} />
                        )
                    })
                }
            </Grid>
        </Box>
    )
}

const HeaderRow = ({}) => {
    return(
        <Grid container>
            <Grid style={{margin: "auto"}} item xs={4}>Check Number</Grid>
            <Grid style={{margin: "auto"}} item xs={4}>Name</Grid>
            <Grid style={{margin: "auto"}} item xs={4}>Button</Grid>
        </Grid>
    )
}

const OrderRow = ({order}) =>{
    const classes = useStyles();
    return(
        <Grid className={classes.row}  style={{backgroundColor: row % 2 === 1 ? "#DCDCDC" : "white", paddingTop: "2px", paddingBottom: "2px"}} container>
                <Grid style={{margin: "auto"}} item xs={4}>{order.checkNumber}</Grid>
                <Grid style={{margin: "auto"}} item xs={4}>{order.firstName + " " + order.lastName}</Grid>
                <Grid style={{margin: "auto"}}  item xs={4}>
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick = {()=>{
                            console.log(index);
                            delivered(index);
                        }}
                    >UNDELETE</Button>
                </Grid> 
        </Grid>
    )
}
