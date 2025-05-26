import React from 'react';

const SearchBar = ({title, input, setInput}) => {
    return (
        <div className='gray-bordered tempTransactionsBlock'>
            <p>{title}</p>
            <div style={{position: 'relative', display: 'flex', gap: 10}}>
                <input
                    className='inputAZS'
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                />
            </div>

        </div>
    );
};

export default SearchBar;