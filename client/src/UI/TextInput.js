import React from 'react';

const TextInput = ({setValue, ...props}) => {

    return (
        <input
            className='input' {...props}
            onChange={e => {
                setValue(e.target.value)
            }}
        />
    );
};

export default TextInput;