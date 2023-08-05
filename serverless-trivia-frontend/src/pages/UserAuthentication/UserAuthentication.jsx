import React from "react";
import LoginRegister from "./LoginRegister";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signInWithGoogle } from "../../firebase-config";
import { useNavigate } from "react-router-dom";


const UserAuthentication = () => {
  const navigate = useNavigate();

  const userSignIn = async () => {
     await signInWithGoogle();
     navigate('/in-game-experience')
  }

  return (
    <div>
      <Box sx={{ margin: "2rem 0" }}>
        <LoginRegister type="REGISTER" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "1rem 0",
          }}
        >
          <hr
            style={{
              width: "80%",
              border: "none",
              borderBottom: "1px solid #ccc",
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", fontFamily: "sans-serif", fontSize: 15 }}
        >
          Already registered?
        </Typography>
        <LoginRegister />
        <Box marginTop={3}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            startIcon={
              <img
                width={20}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/588px-Google_%22G%22_Logo.svg.png"
                alt="Google Icon"
              />
            }
            sx={{
              width: "20%",
            }}
            onClick={userSignIn}
          >
            <Typography
              variant="caption"
              sx={{ textAlign: "center", fontFamily: "Roboto", fontSize: 15 }}
            >
              SIGNIN WITH GOOGLE
            </Typography>
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default UserAuthentication;
