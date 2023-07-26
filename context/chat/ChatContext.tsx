import React, { Dispatch, createContext, useReducer, useState } from "react";
import { chatReducer } from "./chatReducer";

interface ChatContextType {
    chatState: any;
    dispatch: Dispatch<any>;
}

const defaultAuthContext: ChatContextType = {
    chatState: [],
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
    messages: [] // chat selected
}

export const ChatProvider: React.FC<ChildProps> = ({ children }) => {
  
  const [ chatState, dispatch ] = useReducer( chatReducer, initialState );

  return (
    <ChatContext.Provider value={{ chatState, dispatch }}>
        { children }
    </ChatContext.Provider>
  )
}
