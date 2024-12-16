import {
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat, logout, searchUser } from "~/services/api";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
export default function Header() {
  const currentUser = JSON.parse(localStorage.getItem("userInfor"));

  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  //menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //search
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [loadingChat, setLoadingChat] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleSearch = async () => {
    setLoading(true);
    const res = await searchUser(search);
    console.log(res.data);
    setSearchResult(res?.data.users);
    setLoading(false);
  };
  const handNewChat = async (user) => {
    // setLoadingChat(true);
    const infor = {
      userId: currentUser.id,
      user: {
        _id: user._id,
      },
    };
    // console.log(infor);
    await createChat(infor);
    setOpen(false);
    navigate(`/dashboard/${user._id}`);
    //reloading page
    window.location.reload();
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(true)}>
      <Box sx={{ padding: "1em 1em 1em 1em" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            autoFocus
            fullWidth
            label="Search..."
            type="text"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton
            sx={{
              alignSelf: "center",
              bgcolor: "primary.main",
              marginLeft: "0.5em",
            }}
            onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        {loading ? (
          <Typography>Loading</Typography>
        ) : (
          searchResult.map((user) => (
            <Box
              onClick={() => {
                handNewChat(user);
              }}
              key={user._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5em",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "0.5em",
                marginTop: "0.5em",
                bgcolor: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography>{user.userName}</Typography>
                <Typography>{user.email}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1em 2em",
        background: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <div>
        <Button
          variant="outlined"
          onClick={toggleDrawer(true)}
          startIcon={<SearchIcon />}
        >
          Search User
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        {currentUser.email}
      </h1>
      <div>
        <Button
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
          startIcon={<NotificationsActiveIcon />}
        ></Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
        <Button
          variant="outlined"
          // sx={{ mt: 2, alignSelf: "center" }}
          onClick={handleLogout}
        >
          <Typography>Đăng suất</Typography>
        </Button>
      </div>
    </Box>
  );
}
