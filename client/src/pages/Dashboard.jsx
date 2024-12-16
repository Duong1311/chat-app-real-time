// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { fetchChat } from "~/services/api";
// import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { ChatBox } from "./ChatBox";
import { MyChats } from "./MyChats";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfor"));

  // console.log(user);
  const [chat, setChat] = useState(null);
  // const [selectedChat, setSelectedChat] = useState(null);
  const getAllChats = async (id) => {
    const res = await fetchChat(id);
    // console.log(res.data);
    setChat(res?.data.result);
  };

  useEffect(() => {
    getAllChats(user.id);
  }, []);

  // if (!user) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         gap: 2,
  //         width: "100vw",
  //         height: "100vh",
  //       }}
  //     >
  //       <CircularProgress />
  //       <Typography>Loading dashboard user...</Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box className="bg-slate-100 flex flex-col min-h-dvh">
      <Header />
      <Box className="flex flex-row  min-h-max">
        <ChatBox chat={chat} />
        <MyChats />
      </Box>
    </Box>
  );
}

export default Dashboard;
