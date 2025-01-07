import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { socket } from "~/main";
import { setAllChatData } from "~/redux/actions";
import { fetchAllMessages, sendMessages } from "~/services/api";
import { getSender } from "~/utils/supportFuntion";

var selectedChatCompare;
export const MyChats = () => {
  //get chat from url
  const param = useParams();
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.selectedChat);
  const chatData = useSelector((state) => state.chatData);
  const currentUser = JSON.parse(localStorage.getItem("userInfor"));
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [socketConnected, setSocketConnected] = useState(false);
  const allChat = useSelector((state) => state.allChat);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const fetchMessages = async (id) => {
    if (!id) return;
    setLoading(true);
    const res = await fetchAllMessages(id);
    setAllMessages(res?.data.result);
    // console.log(res?.data.result);
    setLoading(false);
    // socket.emit("join chat", id);
  };
  const handleSendMessage = async () => {
    if (newMessage === "") return;
    //send message to server
    //set new message to allMessages

    const res = await sendMessages({
      content: newMessage,
      chatId: param.id,
      _id: currentUser.id,
    });
    socket.emit("new message", res.data.result);
    // console.log(res.data.result);
    setAllMessages([...allMessages, res.data?.result]);

    setNewMessage("");
  };
  useEffect(() => {
    fetchMessages(param.id);
    selectedChatCompare = param;
  }, [param]);

  // useEffect(() => {
  //   // socket.emit("setup", currentUser);
  //   socket.on("connection", (data) => {
  //     console.log(data);
  //     // setSocketConnected(true);
  //   });
  // }, []);
  useEffect(() => {
    const recievedHandler = (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare.id !== newMessageRecieved.chatId._id
      ) {
        //if newMessageRecieved.chatId._id === id on allChat move order of id to top
        const newChat = allChat.filter(
          (c) => c._id !== newMessageRecieved.chatId._id
        );
        //get chat from allChat with id === newMessageRecieved.chatId._id
        const chat = allChat.filter(
          (c) => c._id === newMessageRecieved.chatId._id
        );
        //add chat to top of allChat
        dispatch(setAllChatData([...chat, ...newChat]));

        // dispatch(setAllChatData(newMessageRecieved));
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }
    };

    socket.on("BE_MES_REV", recievedHandler);

    return () => {
      socket.off("BE_MES_REV", recievedHandler);
    };
  }, [allMessages]);

  return (
    <Box
      className="w-full bg-white m-2 rounded-lg text-xl "
      sx={{
        minHeight: "calc(100vh - 85px)",
      }}
      //display chat by selected chat if selected chat is false hiden this component
      display={{
        xs: selectedChat ? "block" : "none",
      }}
    >
      <Box className="m-4">
        <Box className="mb-4 flex flex-row justify-between">
          <h1 className="font-semibold text-2xl uppercase ">
            {!chatData?.isGroupChat ? (
              <div>{getSender(currentUser, chatData?.userIds)}</div>
            ) : (
              // <div>assd</div>
              <div>{chatData?.chatName}</div>
            )}
          </h1>
        </Box>
        <Box
          sx={{
            minHeight: "calc(100vh - 160px)",
            maxHeight: "calc(100vh - 160px)",
          }}
          className="bg-slate-200 mt-4 rounded-lg flex flex-col justify-between"
        >
          <Box className=" overflow-y-auto overflow-hidden">
            {/* auto scroll to bottom? */}

            {loading ? (
              <CircularProgress />
            ) : (
              allMessages.map((m) => (
                <Box
                  key={m._id}
                  className={`${
                    m.senderId._id === currentUser.id
                      ? "flex justify-end"
                      : "flex justify-start"
                  } p-2 `}
                >
                  <div className=" flex flex-row">
                    <div
                      className={`font-semibold rounded-lg p-2 bg-blue-400 ${
                        m.senderId._id === currentUser.id
                          ? "hidden"
                          : "bg-orange-400"
                      }`}
                    >
                      {m.senderId.userName}
                    </div>
                    <div
                      className={` p-2 rounded-lg ${
                        m.senderId._id === currentUser.id
                          ? "bg-blue-400"
                          : "bg-slate-400"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </Box>
              ))
            )}

            <div ref={messagesEndRef} />
          </Box>
          <Box className="flex flex-row justify-between p-2">
            <TextField
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 bg-white"
            />
            <Button onClick={handleSendMessage} variant="contained">
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
