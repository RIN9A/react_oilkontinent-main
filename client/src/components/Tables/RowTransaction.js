import React from 'react';

const RowTransaction = ({transaction}) => {
    return (
        <tr >
            <td>
                <div className="table__wrap">
                    {transaction.card}
                </div>
            </td>
            <td>{transaction.date}</td>
            <td>
                <div className="table__text">
                    {transaction.station}
                </div>
            </td>
            <td>{transaction.oilChanged}</td>
            <td>{transaction.cost}</td>
            <td>{transaction.value.toFixed(2)}</td>
            <td>{Math.round(transaction.value * transaction.cost * 100) / 100}</td>
        </tr>
    );
};

export default RowTransaction;