import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  addUserAuthAnswers,
  validateUserAuthAnswers,
} from "../../services/user-authentication-service";

function LoginRegister({ type = "LOGIN" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [userName, setUserName] = useState("");

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const navigate = useNavigate();

  const authentication = async () => {
    try {
      if (type === "LOGIN") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const {
          user: { displayName, email: userEmail },
        } = await createUserWithEmailAndPassword(auth, email, password);
        setUserName(displayName || userEmail);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(true);
  };

  const handleClose = async () => {
    setOpenDialog(false);
    if (type === "LOGIN") {
      await validateUserAuthAnswers({
        email,
        answer1,
        answer2,
        answer3,
      });
    } else {
      const { user_id } = await addUser(userName, email);
      await addUserAuthAnswers({
        user_id,
        email,
        answer1,
        answer2,
        answer3,
      });
    }
    // login successful: go to next page
    navigate("/in-game-experience");
  };

  const twoFactorAuthDialog = () => {
    return (
      <div>
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Two factor Authentication questions</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Question 1: What is your favorite city to visit?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Answer 1"
              type="email"
              fullWidth
              variant="standard"
              onChange={(event) => setAnswer1(event.target.value)}
            />
          </DialogContent>

          <DialogContent>
            <DialogContentText>
              Question 2: What is your first pet name?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Answer 2"
              type="email"
              fullWidth
              variant="standard"
              onChange={(event) => setAnswer2(event.target.value)}
            />
          </DialogContent>

          <DialogContent>
            <DialogContentText>
              Question 3: What is your favorite cuisine?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Answer 3"
              type="email"
              fullWidth
              variant="standard"
              onChange={(event) => setAnswer3(event.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <>
      {twoFactorAuthDialog()}
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
          onClick={authentication}
        >
          {type}
        </Button>
      </Box>
    </>
  );
}

export default LoginRegister;
