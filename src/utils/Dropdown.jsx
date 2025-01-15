// Dropdown.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dropdown = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dropdown">
      {items.map((item, index) => (
        <div
          key={index}
          className={`menuItem ${
            location.pathname.startsWith(item.link) ? "active" : ""
          }`}
          onClick={() => navigate(item.link)}
        >
          <span>{item.heading}</span>
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
