// frontend/src/App.js
import React, { useState, useEffect } from "react";


import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import CreateSpotModal from "./components/Spots/CreateSpotModal";
import UsersSpots from "./components/Spots/UsersSpots";
import IndividualSpotPage from "./components/Spots/IndividualSpotPage";
import UserBookings from "./components/Bookings/UserBookings";

import './App.css'





function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <Spots />
          </Route>
          {/* <Route path={'/users-spot'}>
            <UsersSpots />
          </Route> */}
          <Route path={'/spots/:spotId'}>
            <IndividualSpotPage />
          </Route>
          <Route path={'/user/bookings'}>
            <UserBookings />
          </Route>


        </Switch>
      )}
    </>
  );
}

export default App;
