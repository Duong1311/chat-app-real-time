import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { MenuItem } from "@mui/material";
import { createGroupChat, searchUser } from "~/services/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

export const ModalAddGroup = ({ open, handleClose }) => {
  const [groupName, setGroupName] = useState("");
  const [addUser, setAddUser] = useState([]);
  const [names, setNames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("userInfor"));

  const handleAddUser = async (groupName, addUser) => {
    const users1 = addUser.map((user) => user.id);
    //delete current user id if user is in the list
    const users = users1.filter((user) => user !== currentUser.id);
    console.log(users);
    await createGroupChat({ chatName: groupName, users });
  };
  const handleSearchUser = async (value) => {
    if (!value) {
      setNames([]);
      return;
    }
    const res = await searchUser(value);
    console.log(res.data);
    setNames(res?.data.users);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Group Chat
        </Typography>
        {/* //form to create group chat by mui */}
        <TextField
          sx={{
            width: "100%",
            marginTop: "10px",
          }}
          placeholder="Name"
          onChange={(e) => setGroupName(e.target.value)}
        />
        {/* add user */}

        <Autocomplete
          sx={{ width: "100%", marginTop: "20px" }}
          multiple
          options={names.map((name) => ({
            id: name._id,
            userName: name.userName,
          }))}
          getOptionLabel={(option) => option.userName}
          disableCloseOnSelect
          onChange={(event, value) => {
            setAddUser(value);
            // value contains the selected options
            console.log(addUser);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Add User"
              placeholder="Add User"
              onChange={(e) => handleSearchUser(e.target.value)}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <MenuItem
              {...props}
              key={option.id}
              value={option.userName}
              sx={{ justifyContent: "space-between" }}
              id={`option-${option.id}`}
            >
              {option.userName}
              {selected ? <CheckIcon color="info" /> : null}
            </MenuItem>
          )}
        />
        <Button
          sx={{
            // width: "100%",
            marginTop: "10px",
          }}
          onClick={() => {
            handleAddUser(groupName, addUser);
          }}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};
