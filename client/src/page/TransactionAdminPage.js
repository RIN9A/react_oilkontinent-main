import React from 'react';
import Transactions from "../modules/Transactions";

const TransactionAdminPage = () => {
    return (
        <div style={{marginTop: 50}}>
            <Transactions cardNumber='all'/>
        </div>
    );
};

export default TransactionAdminPage;