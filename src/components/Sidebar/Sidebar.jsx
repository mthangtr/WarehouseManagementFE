import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/MainDash.css";
import Logo from "../../assets/images/FPT_logo_2010.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../../Data/Data";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import useOutsideClick from "../../utils/useOutsideClick";

const Sidebar = () => {
  const [expanded, setExpaned] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const divRef = useRef(null);
  const handleOutsideClick = () => {
    console.log("Clicked outside the div!");
    setDropdownOpen(false);
  };

  useOutsideClick(divRef, handleOutsideClick);
  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  const handleMenuItemClick = (link) => {
    setDropdownOpen(false)
    navigate(link);
  };
  const handleSubMenuItemClick = (link) => {
    navigate(link);
  };
  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpaned(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            <span>WHA</span>
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <>
              <div
                className={
                  location.pathname.startsWith(item.link) ||
                  (dropdownOpen && item.subItems)
                    ? "menuItem active"
                    : "menuItem"
                }
                key={index}
                onClick={() =>
                  item.subItems
                    ? handleDropdownClick()
                    : handleMenuItemClick(item.link)
                }
              >
                <item.icon />
                <span>{item.heading}</span>
              </div>
              {item.subItems && dropdownOpen && (
                <div className="dropdownMenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={
                        location.pathname.startsWith(subItem.link)
                          ? "subMenuItem activesub"
                          : "subMenuItem"
                      }
                      onClick={() => handleSubMenuItemClick(subItem.link)}
                    >
                      <subItem.icon/>
                      <span>{subItem.heading}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}
          {/* signoutIcon */}
          <div className="menuItem">
            <UilSignOutAlt onClick={handleLogout} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
