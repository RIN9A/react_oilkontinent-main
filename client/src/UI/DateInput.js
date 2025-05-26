import React from 'react';

const DateInput = ({ value, setValue }) => {
  return (
    <input
      type="date"
      value={value ? value.slice(0, 10) : ''}
      onChange={e => setValue(e.target.value)}
      className="form-control"
      style={{ minWidth: '130px' }}
    />
  );
};

export default DateInput;
