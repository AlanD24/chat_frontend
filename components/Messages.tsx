import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Chat.module.scss";
import Image from "next/image";
import { ChatContext } from "@/context/chat/ChatContext";
import SendMessage from "./SendMessage";
import { AuthContext } from "@/auth/AuthContext";
import { MessageModel } from "@/models/Message.model";
import OutgoingMessage from "./OutgoingMsg";
import IncomingMsg from "./IncomingMsg";
import NoMessages from "./NoMessages";
import { fetchWithToken } from "@/helpers/fetch";
import { UserModel } from "@/models/User.model";
import { useDarkModeContext } from "@/context/DarkModeContext";

const defaultUser: UserModel = {
  _user: "",
  email: "",
  name: "",
  online: false,
  lastMessage: "",
  hour: "",
  description: ""
}

export default function Messages() {

  const { chatState } = useContext( ChatContext );
  const { auth } = useContext( AuthContext );
  const [ receptorUser, setReceptorUser ] = useState<UserModel>(defaultUser);
  const { isDarkMode } = useDarkModeContext();

  // Retrive userActiveChat data
  const getUser = async() => {
    try {
      const endpoint: string = `auth/user/${chatState.activeChat}`;
      const response = await fetchWithToken( endpoint );
      
      setReceptorUser(response[0]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if( chatState.activeChat ) {
      getUser();
    }
  }, [ chatState ]);

  return (
    <div className={`${styles.messages}`}>
      {/* Top data begins */}
      <div className={`${styles.topMessages} ${isDarkMode && styles.topMessagesDark}`} >
        <div className={`${styles.topLeftContent} ${ chatState.activeChat == null && styles.hideDiv }`}>
          <div className={styles.topImage}>
            <Image
              src="/user.png"
              alt="userImg"
              width={100}
              height={100}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority={ true }
            ></Image>
          </div>
          <div className={`${styles.topUserContent} ${isDarkMode && styles.userNameDark}`}>
            <h5>{ receptorUser.name }</h5>
            <p>{ receptorUser?.description }</p>
          </div>
        </div>

        <div className={styles.topRightContent}></div>
      </div>
      {/* Top data ends */}

      {/* Container for messages begins */}
      <div className={ `${styles.chatMessages} ${isDarkMode && styles.chatMessagesDark}` }>
        {
          chatState.activeChat ?
          (
            <div 
              className={`${styles.midMessages} ${ chatState.messages.length > 0 ? styles.addScroll : '' }`} 
              id="messages"
            >
              {
                chatState.messages.length ?
                  chatState.messages.map((msg: MessageModel) => 
                    (msg.to === auth._id)
                      ?
                        <IncomingMsg 
                          key={ `msg_${msg._id}` }
                          msg={ msg }
                        ></IncomingMsg>
                      :
                        <OutgoingMessage 
                          key={ `msg_${msg._id}` }
                          msg={ msg }
                        ></OutgoingMessage>
                  )
                :
                  <NoMessages></NoMessages>
              }
            </div>
          )
          :
            <NoMessages></NoMessages>
        }
      </div>
      {/* Container for messages ends */}

      {/* Send message div begins */}
        <SendMessage></SendMessage>
      {/* Send message div ends */}
    </div>
  );
}
