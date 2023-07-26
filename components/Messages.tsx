import React, { useContext } from "react";
import styles from "../styles/Chat.module.scss";
import Image from "next/image";
import { ChatContext } from "@/context/chat/ChatContext";
import SendMessage from "./SendMessage";
import { AuthContext } from "@/auth/AuthContext";
import { MessageModel } from "@/models/Message.model";
import OutgoingMessage from "./OutgoingMsg";
import IncomingMsg from "./IncomingMsg";

export default function Messages() {

  const { chatState } = useContext( ChatContext );
  const { auth } = useContext( AuthContext );

  return (
    <div className={styles.messages}>
      {/* Top data begins */}
      <div className={styles.topMessages}>
        <div className={styles.topLeftContent}>
          <div className={styles.topImage}>
            <Image
              src="/sanji_smiling.jpg"
              alt="userImg"
              width={100}
              height={100}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority={ true }
            ></Image>
          </div>
          <div className={styles.topUserContent}>
            <h5>Vinsmoke Sanji</h5>
            <p>Strawhat's chef</p>
          </div>
        </div>
        <div className={styles.topRighttContent}></div>
      </div>
      {/* Top data ends */}

      {/* Container for messages begins */}
        {
          chatState.activeChat ? (
            <div className={styles.midMessages} id="messages">
              {
                chatState.messages.map((msg: MessageModel) => 
                  (msg.to === auth._id)
                    ?
                      <IncomingMsg 
                        key={ msg._id }
                        msg={ msg }
                      ></IncomingMsg>
                    :
                      <OutgoingMessage 
                        key={ msg._id }
                        msg={ msg }
                      ></OutgoingMessage>
                )
              }
            </div>
          )
          :
            <p>No messages</p>
        }
      {/* Container for messages ends */}

      {/* Send message div begins */}
        <SendMessage></SendMessage>
      {/* Send message div ends */}
    </div>
  );
}
