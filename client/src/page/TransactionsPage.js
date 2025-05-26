import React from 'react';
import Header from "../components/Header";
import Transactions from "../modules/Transactions";

const TransactionsPage = () => {
    return (
        <>
            <Header title='Все транзакции'/>
            <Transactions/>
        </>
    );
};

export default TransactionsPage;

