// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function DemoUserModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('Demo-lition');
  const [password, setPassword] = useState('password');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
      <h1>Demo User</h1>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
          <input
            type="text"
            value={credential}
            // onChange={(e) => setCredential(e.target.value)}
            required
          />

          <input
            type="password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            required
          />

        <button type="submit" className="form-button">Log In</button>
      </form>
    </>
  );
}

export default DemoUserModal;
