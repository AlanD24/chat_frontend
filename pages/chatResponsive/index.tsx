import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/Chat.module.scss";
import Image from "next/image";
import { ChatContext, ChatProvider } from "@/context/chat/ChatContext";
import SendMessage from "../../components/SendMessage";
import { AuthContext, AuthProvider } from "@/auth/AuthContext";
import { MessageModel } from "@/models/Message.model";
import OutgoingMessage from "../../components/OutgoingMsg";
import IncomingMsg from "../../components/IncomingMsg";
import NoMessages from "../../components/NoMessages";
import { fetchWithToken } from "@/helpers/fetch";
import { UserModel } from "@/models/User.model";
import { DarkModeProvider, useDarkModeContext } from "@/context/DarkModeContext";
import { SocketProvider } from "@/context/SocketContext";
import { useRouter } from "next/router";

const defaultUser: UserModel = {
  _user: "",
  email: "",
  name: "",
  online: false,
  lastMessage: "",
  hour: "",
  description: ""
}

export function MessagesResponsive() {

  const [ chatState, setChatState ] = useState<any>(undefined);
  const { auth } = useContext( AuthContext );
  const [ receptorUser, setReceptorUser ] = useState<UserModel>(defaultUser);
  const { isDarkMode } = useDarkModeContext();
  const router = useRouter();
  const { data } = router.query;

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
    if( chatState?.activeChat ) {
        getUser();
    }
  }, [ chatState ]);

  useEffect(() => {
    if(data) {
        const parsedData: any = data;
        const chatAndId = JSON.parse(parsedData);
        chatAndId.chatState.activeChat = chatAndId._id;
        setChatState( chatState );
    }
  }, []);

  return (
    <div className={`${styles.messages}`}>
      {/* Top data begins */}
      <div className={`${styles.topMessages} ${isDarkMode && styles.topMessagesDark}`} >
        {/* <div className={`${styles.topLeftContent} ${ chatState.activeChat == null && styles.hideDiv }`}>
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

        <div className={styles.topRightContent}></div> */}
      </div>
      {/* Top data ends */}

      {/* Container for messages begins */}
      {/* <div className={ `${styles.chatMessages} ${isDarkMode && styles.chatMessagesDark}` }>
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
      </div> */}
      {/* Container for messages ends */}

      {/* Send message div begins */}
        {/* <SendMessage></SendMessage> */}
      {/* Send message div ends */}
    </div>
  );
}

function chatResponsive() {
    return (
        <ChatProvider>
      <AuthProvider>
        <SocketProvider>
            <DarkModeProvider>
                <MessagesResponsive></MessagesResponsive>
            </DarkModeProvider>
        </SocketProvider>
        </AuthProvider>
        </ChatProvider>
    )
}

export default chatResponsive;