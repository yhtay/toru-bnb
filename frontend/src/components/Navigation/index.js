// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import './ProfileButton.css'
import CreateSpotModal from '../Spots/CreateSpotModal';
import OpenModalMenuItem from './OpenModalMenuItem';
// import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import { useEffect, useState, useRef } from 'react';
import * as sessionActions from '../../store/session';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  //--------------------------------------
  // const dispatch = useDispatch();
  // const [showMenu, setShowMenu] = useState(false);
  // const ulRef = useRef();

  // useEffect(() => {
  //   if (!showMenu) return;

  //   const closeMenu = (e) => {
  //     if (!ulRef.current.contains(e.target)) {
  //       setShowMenu(false);
  //     }
  //   };

  //   document.addEventListener('click', closeMenu);

  //   return () => document.removeEventListener("click", closeMenu);
  // }, [showMenu]);

  // const closeMenu = () => setShowMenu(false);

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  //   closeMenu();
  // };
  // ---------------------------------------
  return (
    <div className='navigation-container'>

      <div className="home-div">
        <NavLink exact to="/">
          <i class="fa-brands fa-dribbble fa-3x icon-cog"></i>
        </NavLink>
      </div>
      <div className='your-toru-profile-button'>

        <div className='your-toru-bnb'>
          {sessionUser ? (
            <OpenModalMenuItem
                  itemText="Create Toru-BnB"
                  // onItemClick={closeMenu}
                  modalComponent={<CreateSpotModal />}
            />
          ) : (
            <OpenModalMenuItem
                  itemText="Create Toru-BnB"
                  modalComponent={<LoginFormModal />}
            />
          )}

        </div>

        {isLoaded && (
            <ProfileButton user={sessionUser} />
        )}

      </div>
    </div>
  );
}

export default Navigation;
