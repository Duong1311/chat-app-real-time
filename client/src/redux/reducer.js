import { SET_CHAT_DATA, SET_SELECTED_CHAT, SET_ALL_CHAT_DATA } from "./actions";

const initialState = {
  selectedChat: false,
  chatData: [],
  allChat: [],
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case SET_CHAT_DATA: {
      return {
        ...state,
        chatData: action.payload,
      };
    }
    case SET_ALL_CHAT_DATA: {
      return {
        ...state,
        allChat: action.payload,
      };
    }
    default:
      return state;
  }
};
export default rootReducer;
