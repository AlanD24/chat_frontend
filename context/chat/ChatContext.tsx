import React, { Dispatch, createContext, useEffect, useReducer, useState } from "react";
import { chatReducer } from "./chatReducer";
import { types } from "@/types/types";

interface ChatContextType {
    chatState: any;
    dispatch: Dispatch<any>;
}

const defaultAuthContext: ChatContextType = {
    chatState: { users: [], usersCopy: [] },
    dispatch: () => {}
};

interface ChildProps {
    children: any;
}

export const ChatContext = createContext( defaultAuthContext );

const initialState = {
    _id: "",
    activeChat: null, // _user of the other user who
    users: [], // all users from DB
    usersCopy: [],
    messages: [] // chat selected
}

export const ChatProvider: React.FC<ChildProps> = ({ children }) => {
  
  const [ chatState, dispatch ] = useReducer( chatReducer, initialState );

  useEffect(() => {
    if (chatState?.usersCopy?.length >= 1) {
      dispatch({ type: types.setUsers, payload: chatState.usersCopy });
    } else {
      dispatch({ type: types.setUsers, payload: chatState.users });
    }
  }, [chatState.usersCopy, chatState.users]);

  return (
    <ChatContext.Provider value={{ chatState, dispatch }}>
        { children }
    </ChatContext.Provider>
  )
}