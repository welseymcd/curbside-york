const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require("moment");
const mailgun = require("mailgun-js");
const express = require("express");
const routesConfig = require("./users/routes-config.js").routesConfig;

const cors = require("cors");
const bodyParser = require("body-parser");

const DOMAIN = process.env.MAILGUN_DOMAIN;
const apiKey = process.env.MAILGUN_API_KEY;
const mg = DOMAIN && apiKey ? mailgun({
    apiKey: apiKey,
    domain: DOMAIN
}) : null;

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
const firebaseConfigRaw = process.env.FIREBASE_CONFIG;
const firebaseConfig = firebaseConfigRaw ? JSON.parse(firebaseConfigRaw) : {};
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: firebaseConfig.databaseURL || process.env.FIREBASE_DATABASE_URL
});




const calculateDate = () => {
    // If today isn't thursday. Add days to get to thursday
    const dayInNeed=4;
    if(moment().isoWeekday() <= dayInNeed) {
        return moment().isoWeekday(dayInNeed);
    } else {
        return moment().add(1, "weeks").isoWeekday(dayInNeed);
    }
}
exports.addeventorder = functions.https.onRequest(async (request, response)=>{
    if(!mg) {
        response.status(500).send("Mailgun is not configured. Set MAILGUN_DOMAIN and MAILGUN_API_KEY.");
        return;
    }
    const data = {
        from: "Texas Roadhouse Curbside <postmaster@mg.curbside.tools>",
        to: "ross@wrm.one",
        subject: "Confirmation - Farmer's Market - Texas Roadhouse",
        template: "confirmation_email",
        'h:X-Mailgun-Variables': JSON.stringify({
            "orderNumber": "123sd-sdfx0",
            "orderDate": "May 14th, 2020",
            "total": "47.00",
            "user": {
                "orders": [
                    {
                        "item": "Produce Box",
                        "quantity": "1",
                        "total": "45.00"
                    },
                    {
                        "item": "Peanuts",
                        "quantity": "1",
                        "total": "2.00"
                    }
                ]
            }
        })
    };
    mg.messages().send(data, function(error, body) {
        if(error){
            response.send(error);
            return;
        }
        response.send(body);
        return;
    })
})
exports.addOrder = functions.https.onRequest(async (request, response)=>{
    const tempCheck = {
        firstName: "",
        lastName: "",
        phone: "",
        farmersMarket: false,
        checkNumber: "",
        needManager: false,
        needsToOrder: false,
        futureOrder: false,
        arrived: false,
        bagged: false,
        delivered: false,
        paid: false,
        rtgSteaks: false,
        deleted: false,
        spotNumber: "",
        arrivalTime: "",
        enteredTime: "",
        paidTime: '',
        baggedTime: '',
        lemonade: 0,
        peanuts: 0,
        sweetTea: 0,
        unsweetTea: 0,
        boxes: 0,
        fountainDrink: 0,
        ribeyePack: 0,
        seafoodPack: 0,
        condimentPack: 0,
        payment: "",
        notes: "",
        promisedTime: moment().format(),
      };
    if(!request.query.firstname) {
        response.send("Please enter a first name");
        return;
    }
    var date = calculateDate()
    if(request.query.date){
        console.log(request.query.date);
       date = moment(String(request.query.date).trim(), "YYYY-MM-DD"); 
    }
    const firstName = request.query.firstname;
    const lastName = request.query.lastname || "";
    if(!request.query.boxes){
        response.send("Please enter box count");
        return;
    }
    const boxes = parseFloat(request.query.boxes);
    const phone = request.query.phone;
    const peanuts = parseFloat(request.query.peanuts) || 0;
    const lemonade = parseFloat(request.query.lemonade) || 0;
    const sweetTea = parseFloat(request.query.sweetTea) || 0;
    const unsweetTea = parseFloat(request.query.unsweetTea) || 0;
    const condimentPack = parseFloat(request.query.condimentpack) || 0;
    const ribeyePack = parseFloat(request.query.ribeyepack) || 0;
    const seafoodPack = parseFloat(request.query.seafoodpack) || 0;
    const notes = request.query.notes || "";




    const checksRef = admin.database().ref("/checks/" + date.format("MM-DD-YYYY") + "/114");


    tempCheck.boxes = boxes;
    tempCheck.phone = phone;
    tempCheck.peanuts = peanuts;
    tempCheck.lemonade = lemonade;
    tempCheck.sweetTea = sweetTea;
    tempCheck.unsweetTea = unsweetTea;
    tempCheck.firstName = firstName;
    tempCheck.lastName = lastName;
    tempCheck.farmersMarket = true;
    tempCheck.ribeyePack = ribeyePack;
    tempCheck.seafoodPack=seafoodPack;
    tempCheck.condimentPack = condimentPack;
    tempCheck.notes = notes;


    await checksRef.push(tempCheck);
    response.send("success")
}) 
