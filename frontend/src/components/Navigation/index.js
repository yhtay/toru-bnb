// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import CreateSpotModal from '../Spots/CreateSpotModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import { useEffect, useState, useRef } from 'react';
import * as sessionActions from '../../store/session';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  //--------------------------------------
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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
  };
  // ---------------------------------------
  return (
    <ul className='navigation-container'>
      <div>
        <NavLink exact to="/">Home</NavLink>
      </div>
      <div className='profile-button-and-toru-div'>
      <div className='your-toru-bnb-modal'>
        <OpenModalMenuItem
                itemText="Your Toru-BnB"
                onItemClick={closeMenu}
                modalComponent={<CreateSpotModal />}
              />
      </div>
        {isLoaded && (
          <div>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </ul>
  );
}

export default Navigation;
