import moment from "moment";

export const prices = {
    "peanuts": 2.00, 
    "sweetTea": 2.99,
    "unsweetTea": 2.99,
    "lemonade": 2.99,
    "boxes": 45.00,
    "fountainDrink": 2.99,
    "ribeyePack": 54.99,
    "seafoodPack": 49.99,
    "condimentPack": 10.00,
    
}
export const emptyCheck = {
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
    paid: false,
    notes: "",
    promisedTime: moment().format(),
  };

export const PositionTitles = {
    all: "All",
    runner: "Runner",
    bagger: "Bagger",
    paymentTaker: "Payment Taker",
    paymentRunner: "Payment | Runner",
    trafficControl: "Traffic Control",
    orderEntry: "Order Entry",
    delivered: "Delivered",
    deleted: "Deleted",
    farmersMarket: "Farmer's Market",
};
export const positions = [
    {
        title: "All",
        paid: null,
        arrived: null,
        bagged: null,
        delivered: false,
        famersMarket: false,
        deleted: false,
    },
    {
        title: "Runner",
        paid: true,
        arrived: true,
        bagged: true,
        delivered: false,
        famersMarket: false,
        deleted: false,
    },
    {
        title: "Bagger",
        paid: null,
        arrived: null,
        bagged: false,
        delivered: false,
        famersMarket: false,
        deleted: false,

    }, 
    {
        title: "Payment Taker",
        paid: false,
        arrived: true,
        bagged: null,
        delivered: false,
        famersMarket: false,
        deleted: false,

    }, 
    {
        title: "Payment | Runner",
        paid: null,
        arrived: true,
        bagged: null,
        delivered: false,
        famersMarket: false,
        deleted: false,

    },
    {
        title: "Traffic Control",
        paid: null,
        arrived: false,
        bagged: null,
        delivered: false,
        famersMarket: false,
        deleted: false,

    }, 
    {
        title: "Order Entry",
        paid: null,
        arrived: null,
        bagged: null,
        delivered: false,
        famersMarket: false,
        deleted: false,

    }, 
    {
        title: "Delivered",
        paid: null,
        arrived: null,
        bagged: null,
        delivered: true,
        famersMarket: false,
        deleted: false,
    },
    {
        title: "Deleted",
        paid: null,
        arrived: null,
        bagged: null,
        delivered: true,
        famersMarket: false,
        deleted: false,
    },
    {
        title: "Farmer's Market",
        paid: null,
        arrived: null,
        bagged: null,
        farmersMarket: true,
        delivered: false,
        deleted: false
    }
];
export var positionIndex = {}
positions.forEach((position, index)=>{
    positionIndex[position.title] = index;
});