export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";
export const SET_CHAT_DATA = "SET_CHAT_DATA";

export const setSelectedChat = (boolean) => ({
  type: SET_SELECTED_CHAT,
  payload: boolean,
});
export const setChatData = (data) => ({
  type: SET_CHAT_DATA,
  payload: data,
});
//

//action creators
