import { Box, Button } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getSender } from "~/utils/supportFuntion";
import { useState } from "react";
import { ModalAddGroup } from "~/components/ModalAddGroup";
import { useDispatch, useSelector } from "react-redux";
import { setChatData, setSelectedChat } from "~/redux/actions";

export const ChatBox = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const currentUser = JSON.parse(localStorage.getItem("userInfor"));
  const selectedChat = useSelector((state) => state.selectedChat);
  const chat = useSelector((state) => state.allChat);

  const handleChat = (c) => {
    console.log(c);
    //add id to url by react query
    // setChatParams({ chat: id });
    navigate(`/dashboard/${c._id}`);
    dispatch(setChatData(c));
    dispatch(setSelectedChat(true));
  };

  return (
    <Box
      className="w-full lg:w-1/3 md:w-1/3 sm:w-1/3 bg-white m-2 rounded-lg  "
      sx={{
        minHeight: "calc(100vh - 85px)",
      }}
      display={{ xs: selectedChat ? "none" : "block", md: "block" }}
    >
      <Box className="m-4">
        <Box className="mb-4 flex flex-row justify-between">
          <h1 className="font-semibold text-2xl ">ChatBox</h1>
          <Button
            onClick={handleOpen}
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
          >
            Tạo nhóm
          </Button>
        </Box>
        <Box className="flex flex-col gap-2">
          {chat ? (
            chat.map((c) => (
              <Box
                className="bg-slate-200 p-2 rounded-lg hover:bg-slate-300"
                key={c._id}
                onClick={() => {
                  handleChat(c);
                }}
              >
                {!c.isGroupChat ? (
                  <div>{getSender(currentUser, c.userIds)}</div>
                ) : (
                  <div>{c.chatName}</div>
                )}
              </Box>
            ))
          ) : (
            <p>No chat available</p>
          )}
        </Box>
      </Box>
      <ModalAddGroup open={open} handleClose={handleClose} />
    </Box>
  );
};
