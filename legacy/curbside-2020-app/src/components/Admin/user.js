import React, { useState } from "react";
import { Paper, Grid, Container, Typography, Divider, CircularProgress, Box } from "@material-ui/core";
import {UserContext} from "../../utils/appcontext";
import { useEffect } from "react";
import {useParams} from "react-router-dom";
import {getEmployee} from "../../utils/userfunctions";

const UserTable = (props) => {

}


const UserProfile = (props) =>{
    const {user} = React.useContext(UserContext);
    let { id } = useParams();
    const [userView, setUserView] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(id) {
            setLoading(true);
            getEmployee(id).then((userData)=>{
                setUserView(userData);
                setLoading(false);
            })
        } else {
            setUserView(user.user)
        }
    }, [id])
    if(loading){
        return (<Box style={{marginTop: 8}}>
                <Typography variant="h4" component="h4">Loading User...</Typography>
                <br />
                <CircularProgress color="inherit" />
            </Box>)

    } else {
        return(
            <Container>
                <UserView user={userView} />
            </Container>
        )
    }

}

const UserView = (props) => {
    const {user} = props;
    const [role, setRole] = React.useState(null)
    let { id } = useParams();


    return(
        <Paper style={{marginTop: 8}}>
            <Typography variant="h4" component="h4">User Profile </Typography>
            <Divider />
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h6" component="span">Display Name: </Typography> {user.displayName}
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6" component="span">E-Mail:</Typography> {user.email}
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6" component="span"> Role: </Typography> 
                </Grid>
            </Grid>
        </Paper>
    )
}

export default UserProfile;