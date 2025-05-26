import React from 'react';

const TimeInput = ({ value, setValue, placeholder = '' }) => {
  return (
    <input
      type="time"
      value={value || ''}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      className="form-control"
      style={{ minWidth: '100px' }}
    />
  );
};

export default TimeInput;
