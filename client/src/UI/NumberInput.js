import React from 'react';

const NumberInput = ({setValue, ...props}) => {

    return (
        <input
            className='input' {...props}
            onChange={e => {
                const result = Number(e.target.value.replace(/\D/g, ''));
                setValue(result)
            }}
        />
    )
}
export default NumberInput