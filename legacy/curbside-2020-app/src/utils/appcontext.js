import React, {createContext} from "react";

const OrdersContext = createContext({
    orders: {}
});
const ParkingLotContext = createContext({
    parkingLot: [],
});
export const UserContext = createContext({
    user: null
});

export const AppContext = createContext();


const updateOrder = (index, order) => {

}
