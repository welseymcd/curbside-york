import axios from "axios";
import firebase from '../components/firebase';

export const getEmployee = async (id) =>{
    const url = "http://localhost:5001/curbside-1245/us-central1/api/users/view/" + id
    const token = await firebase.auth().currentUser.getIdToken(true);
    return axios.get(url, {
        headers: {
            'Authorization':  'Bearer ' + token,
            'Content-Type': "text/plain"
        }
    }).then((response)=>{
        return response.data.user;
    })
    .catch((response)=>{
        console.log(response);
        return "Error"
    })
}

