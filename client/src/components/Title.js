import React from 'react';

const Title = ({title}) => {

    let temp = 0
    console.info('checked component:', ++temp)

    return (
        <div className='title'>
            <p className='header-lk__title'>{title}</p>
        </div>
    );
};

export default Title;