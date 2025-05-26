import React from 'react';

const RowTransaction = ({transaction}) => {
    return (
        <tr>
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
            <td>{transaction.value}</td>
        </tr>
    );
};

export default RowTransaction;