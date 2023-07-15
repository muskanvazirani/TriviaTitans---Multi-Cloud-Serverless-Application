import React from "react";
import LoginRegister from "./LoginRegister";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const UserAuthentication = () => {
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
      </Box>
    </div>
  );
};

export default UserAuthentication;
