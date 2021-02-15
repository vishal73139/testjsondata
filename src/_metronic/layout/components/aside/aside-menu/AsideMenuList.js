/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}



      {/* RMS Code */} 

        <li className="menu-section ">
          <h4 className="menu-text">Rule Authoring</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>

        <li
          className={`menu-item menu-item-submenu`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
        
          <NavLink className="menu-link menu-toggle" to="/create-rules">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">Create Rule</span>
            <i className="menu-arrow" />
          </NavLink>

          <NavLink className="menu-link menu-toggle" to="/view-rules">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">View Rules</span>
            <i className="menu-arrow" />
          </NavLink>

          <NavLink className="menu-link menu-toggle" to="/execute-rules">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">Execute Rules</span>
            <i className="menu-arrow" />
          </NavLink>

        </li>

      {/* RMS Code End Here*/} 

    {/* Exception Code */} 

        <li className="menu-section ">
          <h4 className="menu-text">Exceptions</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>

        <li
          className={`menu-item menu-item-submenu`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
        
          <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">View Exceptions</span>
            <i className="menu-arrow" />
          </NavLink>

        </li>

      {/* Exception End Here*/} 

      {/* Adjustments Code */} 

        <li className="menu-section ">
          <h4 className="menu-text">Adjustments</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>

        <li
          className={`menu-item menu-item-submenu`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
        
          <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">Adjust Exceptions</span>
            <i className="menu-arrow" />
          </NavLink>

        </li>

      {/* Adjustments End Here*/} 


        
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
