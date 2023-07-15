import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

function LoginRegister({ type = 'LOGIN' }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);   
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <TextField
        required
        id="outlined-required"
        sx={{ width: "20%" }}
        label="Email Address"
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        required
        id="outlined-password-input"
        label="Password"
        type="password"
        sx={{ width: "20%" }}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        variant="contained"
        size="medium"
        sx={{
          width: "20%",
          backgroundColor: "rgb(4, 59, 114)",
        }}
        onClick={register}
      >
        {type}
      </Button>
    </Box>
  );
}

export default LoginRegister;
