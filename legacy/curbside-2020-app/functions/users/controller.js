
const admin = require("firebase-admin");

async function create(req, res) {
    try {
        const {displayName, password, email, role} = req.body;
        if(!displayName || !password || !email || !role) {
            return res.status(400).send({message: "Missing Fields"});
        } 
        const {uid} = await admin.auth().createUser({
            displayName,
            password,
            email
        })
        await admin.auth().setCustomUserClaims(uid, {role});
        return res.status(201).setCustomUserClaims(uid, {role})
    } catch (err) {
        return handleError(res, err);
    }
}

async function get(req, res){
    try {
        console.log("Get    ")
        const {id} = req.params;
        const user = await admin.auth().getUser(id);
        return res.status(200).send({user: mapUser(user)});
    } catch (err) {
        return handleError(res, err)
    }
}

async function all(req, res) {
    console.log("All")
    try {
        const listUsers = await admin.auth().listUsers()
        const users = listUsers.users.map(mapUser)
        return res.send({ users })
    } catch (err) {
        return handleError(res, err)
    }
}

function mapUser(user) {
    const customClaims = (user.customClaims || { role: '' });
    const role = customClaims.role ? customClaims.role : ''
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
    }
}

async function patch(req, res) {
    try {
        const { id } = req.params
        const { displayName, password, email, role } = req.body
 
        if (!id || !displayName || !password || !email || !role) {
            return res.status(400).send({ message: 'Missing fields' })
        }
 
        await admin.auth().updateUser(id, { displayName, password, email })
        await admin.auth().setCustomUserClaims(id, { role })
        const user = await admin.auth().getUser(id)
 
        return res.status(204).send({ user: mapUser(user) })
    } catch (err) {
        return handleError(res, err)
    }
 }
 
 async function remove(req, res) {
    try {
        const { id } = req.params
        await admin.auth().deleteUser(id)
        return res.status(204).send({})
    } catch (err) {
        return handleError(res, err)
    }
 }

function handleError(res, err) {
    console.log(err);
    return res.send({message: err.code+' - ' + err.message});
}

module.exports = {
    create,
    all,
    get,
    create,
    patch,
    remove
}