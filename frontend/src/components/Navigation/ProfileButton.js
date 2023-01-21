import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import DemoUserModal from "../DemoUserFormModal";
import "./ProfileButton.css"
import { useHistory } from "react-router-dom";


function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div>
        <button className="profile-button" onClick={openMenu}>
            <div >
              <i className="fa-solid fa-bars fa-1x"></i>
            </div>
            <div className="profile-icon-div">
              <i className="fas fa-user-circle fa-2x" />
            </div>
        </button>
      </div>

        <div className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <div className="dropdown username-div">{user.username}</div>
              <div className="dropdown firstName-div">{user.firstName} {user.lastName}</div>
              <div className="dropdown email-div">{user.email}</div>
              <div>
                <button
                  onClick={logout}
                  className="button"
                  >
                    Log Out</button>
              </div>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
              <OpenModalMenuItem
                className="demoUser-div"
                itemText="Demo User"
                onItemClick={closeMenu}
                modalComponent={<DemoUserModal />}
              />
            </>
          )}
        </div>
      </>
  );
}

export default ProfileButton;
