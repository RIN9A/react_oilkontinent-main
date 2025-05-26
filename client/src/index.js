import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import UserStore from "./store/UserStore";
import CardsStore from "./store/CardStore";
import ContractsStore from "./store/ContractsStore";
import TransactionsStore from "./store/TransactionsStore";
import AdminStore from "./store/AdminStore";


export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        admin: new AdminStore(),
        user: new UserStore(),
        cards: new CardsStore(),
        contracts: new ContractsStore(),
        transactions: new TransactionsStore(),
    }}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Context.Provider>
);
