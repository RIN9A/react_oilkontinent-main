import React from 'react';

const Dropdown = ({ 
  title, 
  onClickSet, 
  options = [], 
  activeDropdown, 
  setActiveDropdown,
  customContent 
}) => {
  function dropdownHandler(target) {
    if (activeDropdown !== target) {
      if (activeDropdown) {
        activeDropdown?.classList?.remove('open');
        activeDropdown?.children[1]?.classList.remove('active');
      }

      target.classList.add('open');
      target.children[1].classList.add('active');
      setActiveDropdown(target);
    }
    else if (activeDropdown === target) {
      activeDropdown.classList.remove('open');
      activeDropdown?.children[1]?.classList.remove('active');
      setActiveDropdown(null);
    }
  }

  return (
    <div className="filter__item">
      <div className="filter__dropdown">
        <div 
          className="filter__dropdown-toggle js-toggle" 
          onClick={e => dropdownHandler(e.target.offsetParent)}
        >
          {title}
        </div>
        <div className="filter__dropdown-content">
          {customContent ? (
            customContent
          ) : (
            <ul className="filter__dropdown-list">
              <li className="filter__dropdown-item">
                {options.map(option =>
                  <button 
                    key={option} 
                    type="button" 
                    className="filter__dropdown-value" 
                    onClick={() => onClickSet(option)}
                  >
                    {option}
                  </button>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;