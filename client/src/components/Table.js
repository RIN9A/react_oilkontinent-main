import React from 'react';

const Table = ({rows, rowComponent, headers, style}) => {
    return (
        <div className="table-section">
            <table className="table" style={style}>
                <thead className="table__head">
                <tr>
                    {headers.map((header, index) => <th key={"header0-"+index} scope="col">{header}</th>)}
                </tr>
                </thead>
                <tbody>
                { rows.length > 0 &&
                    rows.map((transaction, index) => React.cloneElement(rowComponent,{ transaction:transaction, key:"transaction-"+index }))
                }
                </tbody>
            </table>
        </div>
    );
};

export default Table;