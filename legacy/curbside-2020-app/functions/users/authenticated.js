const admin = require("firebase-admin");

async function isAuthenticated(req, res, next) {
    const {authorization} = req.headers;
    console.log("Authenticated");
    if(!authorization) 
        return res.status(401).send({message: 'Unauthorized'});

    if(!authorization.startsWith('Bearer'))
        return res.status(401).send({message: 'Unauthorized'});

    const split = authorization.split('Bearer ');
    if(split.length !== 2) {
        return res.status(401).send({message: 'Unauthorized'});
    }

    const token = split[1]

    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.locals = {...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email}
        console.log("Test");
        next();
    } catch (err) {
        return res.status(401).send({message: 'Unauthorized'});
    }
}

module.exports = {
    isAuthenticated
}