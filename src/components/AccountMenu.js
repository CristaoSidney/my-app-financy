import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Divider, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import Avatar from '@mui/material/Avatar';

export default function AccountMenu({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Botão para abrir o menu */}
      <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>I</Avatar>
          </IconButton>
        </Tooltip>

      {/* Menu suspenso */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <AccountCircleIcon style={{ marginRight: 8 }} />
          <Typography>Profile</Typography>
        </MenuItem>

        <Divider />

        <MenuItem>
          <SettingsIcon style={{ marginRight: 8 }} />
          <Typography>Settings</Typography>
        </MenuItem>

        <MenuItem onClick={onLogout}>
          <LogoutIcon style={{ marginRight: 8 }} />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}