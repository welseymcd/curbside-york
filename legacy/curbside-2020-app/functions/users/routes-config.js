const {isAuthenticated} = require('./authenticated');
const {isAuthorized} = require('./authorized');
const admin = require("firebase-admin")
const {get, all, create, patch} = require('./controller');

function routesConfig(app) {
    app.post('/users', 
        isAuthenticated,
        ()=>isAuthorized({hasRole: ['admin', 'manager']}),
        create
    );
    app.get('/users/view/:id', [
        isAuthenticated,
        get
    ])
    app.get('/users', [
        isAuthenticated,
        ()=>isAuthorized({hasRole: ['admin', 'manager']}),
        all
    ]);
    app.patch('/users/modify/:id', [
        isAuthenticated,
        ()=>isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
        patch
    ]);
    app.get('/update', [async (req, res)=>{
        const results = await admin.auth().updateUser("P8rM5un8tNT4Wm9lYq3E3I78Xd43", { displayName: "Ross McDonald"})
        await admin.auth().setCustomUserClaims("P8rM5un8tNT4Wm9lYq3E3I78Xd43", {role: "admin"});

        if(results){
            console.log("Success")
            res.send("Success")
            return;
        }
        res.send("Test");
    }])
}

module.exports = {
    routesConfig
}