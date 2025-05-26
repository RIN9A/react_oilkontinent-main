import React, { useState } from "react";

const FieldChanger = ({ children, table_field, value, setField }) => {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      onClick={(e) => {
        if (
          !e.target.classList.contains("changingField") &&
          !e.target.parentNode.classList.contains("changingField")
        )
          setHidden(!hidden);
      }}
    >
      {hidden ? (
        <p className="changingField">
          <input
            type="text"
            defaultValue={value}
            name={table_field}
            onChange={(e) => setField(e.target)}
          />
          <span
            onClick={() => setHidden(false)}
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              background: "#f3f3f3",
              marginLeft: 12,
              cursor: "pointer",
            }}
          >
            Сохранить
          </span>
        </p>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default FieldChanger;
