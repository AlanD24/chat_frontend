import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Chat.module.scss";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ChatContext } from "@/context/chat/ChatContext";
import { UserModel } from "@/models/User.model";
import { AuthContext } from "@/auth/AuthContext";
import { types } from "@/types/types";
import { fetchWithToken } from "@/helpers/fetch";
import { scrollToBottom } from "@/helpers/scrollToBottom";
import SearchUser from "./SearchUser";

export default function ContacsList() {

  const { chatState } = useContext( ChatContext );
  const { auth } = useContext( AuthContext );
  const { _id } = auth;
  const [ users, setUsers ] = useState([]);

  const { dispatch } = useContext( ChatContext );

  const setActiveChat = async (user: UserModel) => {
    
    dispatch({
      type: types.activateChat,
      payload: user._user
    });

    // Retrieve list of messages
    const endpoint: string = `messages/get-all/${ user._user }`;
    const resp = await fetchWithToken( endpoint );

    // Shoot action
    dispatch({
      type: types.loadMessages,
      payload: resp.messages
    });

    // Move to bottom of the chat
    scrollToBottom('messages');
  }

  useEffect(() => {
    ( chatState.usersCopy.length >= 1 )
      ? setUsers( chatState.usersCopy )
      : setUsers( chatState.users );
  }, [ chatState ]);

  return (
    <div className={styles.recentChats}>
      {/* User data begins */}
      <div className={styles.userData}>
        <Image
          className={styles.userImage}
          src="/user.png"
          alt="userImg"
          width={70}
          height={70}
          style={{ objectFit: "cover" }}

        ></Image>
        <div className={styles.userName}>
          <h3>{ auth.name }</h3>
          <p>Strawhat's pirates captain</p>
        </div>
        <div className={styles.editIcon}>
          <EditIcon></EditIcon>
        </div>
      </div>
      {/* User data ends */}

      {/* Searchbox begins */}
      <SearchUser></SearchUser>
      {/* Searchbox ends */}

      {/* Sidebar begins */}
      <div className={ styles.conversations }>
        {/* Users list begins */}
          { 
            (users.length >= 1 ? 
                users.filter((user: any) => user._user != _id).map((user: UserModel) =>
                  <div 
                    className={ `${styles.activeUser}` } 
                    key={ user._user }
                    onClick={ () => setActiveChat(user) }
                  >
                    <div className={ styles.activeUserImg }>
                      <Image
                        src="/user.png"
                        alt="userImg"
                        width={70}
                        height={70}
                        style={{ borderRadius: '50%', objectFit: "cover" }}
                      ></Image>
                      { user.online && <div className={ styles.isConnected }></div> }
                    </div>
                    <div className={ styles.activeUserData }>
                        <div className={ styles.innerUserData }>
                            <h5>{ user.name }</h5>
                            <span className={ styles.deliverMessage }>6:13 pm</span>
                        </div>
                        <div className={ styles.innerUserData }>
                          <p>Lorem ipsum dolor sit amet agaga adipisicing elit.</p>
                          <div className={ styles.messagesNotRead }>
                            <span>1</span>
                          </div>
                        </div>
                    </div>
                  </div>
                )
              :
                <p>No users</p>
            )
          }
        {/* Users list ends */}

        {/* Extra space for scroll */}
        <div className="extra_space"></div>
      </div>
      {/* Sidebar ends */}
    </div>
  );
}
