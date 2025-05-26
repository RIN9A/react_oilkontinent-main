import React from 'react';
import Header from "../components/Header";
import Payments from "../components/Payments";

const PaymentsPage = () => {
    return (
        <>
            <Header title='История операций по счету'/>
            <Payments />
        </>
    );
};

export default PaymentsPage;