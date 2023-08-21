import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Chat.module.scss";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import { ChatContext } from "@/context/chat/ChatContext";
import { UserModel } from "@/models/User.model";
import { AuthContext } from "@/auth/AuthContext"; 
import { types } from "@/types/types";
import { fetchWithToken } from "@/helpers/fetch";
import { scrollToBottom } from "@/helpers/scrollToBottom";
import SearchUser from "./SearchUser";

interface ContactsListProps {
  onButtonClick: (value: boolean) => void;
}

const ContacsList: React.FC<ContactsListProps> = function({ onButtonClick }) {

  const [ users, setUsers ] = useState<UserModel[]>([]);
  const [ doLoad, setDoLoad ] = useState<boolean>(false);
  const [ avatarSrc, setAvatarSrc ] = useState("/user.png");
  const { chatState } = useContext( ChatContext );
  const { auth } = useContext( AuthContext );
  const { _id } = auth;

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

  const getLastMessages = async(users: UserModel[]) => {
    // Send petition to backend
    const endpoint: string = "messages/last-messages";
    const data = JSON.stringify({ users });
    const result = await fetchWithToken( endpoint, "POST", data);

    // Set values
    if( result.length > 0 ) {
      // Set last messages to users list
      setLastMessages( result, users );

      // Sort users list, according if they have last message
      sortUsersList( users );
    }
  }

  const setLastMessages = (result: any[], users: UserModel[]) => {
    // Compare userIds
    const indexById: any = {};
    for(let user of result) {
      indexById[user.userId] = user;
      
    }

    for(let user of users) {
      // Check ids are the same
      if(indexById[user._user] && indexById[user._user].userId === user._user) {
        // Check they have last message
        if(indexById[user._user].hour !== '' && indexById[user._user].lastMessage !== null) {
          user.hour = indexById[user._user].hour;
          user.lastMessage = indexById[user._user].lastMessage
        }
      }
    }

    return { result, users };
  }

  const sortUsersList = (usersList: UserModel[]) => {
    usersList.sort((a, b) => {
      // If both have or not have lastMessage, remains the same
      if((a.lastMessage && b.lastMessage) || (!a.lastMessage && !b.lastMessage)) {
        return 0;
      }

      // If a has lastMessage, position first a before b
      if(a.lastMessage) {
        return -1;
      }

      return 1;
    });

    setDoLoad(true);
  }

  const handleEditInfo = () => {
    onButtonClick(true);
  }

  useEffect(() => {
    ( chatState.usersCopy.length >= 1 )
      ? setUsers( chatState.usersCopy )
      : setUsers( chatState.users );
  }, [ chatState, users ]);

  useEffect(() => {
    if( users.length >= 1 ) {
      // Retrieve last message for each user
      getLastMessages( users );
    }
  }, [ users ]);

  useEffect(() => {
    const getAndSetAvatar = async(): Promise<void> => {
      const imageUrl: string = `http://localhost:8080/uploads/${auth.image}`;
      setAvatarSrc(imageUrl);
    }

    getAndSetAvatar();
  }, [ auth ]);

  return (
    <div className={styles.recentChats}>
      {/* User data begins */}
      <div className={styles.userData}>
        <Image
          className={styles.userImage}
          src={ avatarSrc }
          alt="userImg"
          width={70}
          height={70}
          style={{ objectFit: "cover" }}
        ></Image>

        <div className={styles.userName}>
          <h3>{ auth.name }</h3>
          <p>{ auth?.description }</p>
        </div>
        <div 
          className={styles.editIcon}
          onClick={ handleEditInfo }
        >
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
            (users.length >= 1 && doLoad ? 
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
                            <span className={ styles.deliverMessage }>
                              { user?.hour }
                            </span>
                        </div>
                        <div className={ styles.innerUserData }>
                          <p>
                            { user?.lastMessage ?
                                user.lastMessage
                              :
                                'Be the first to say "Hi!"'
                            }
                          </p>
                          { /* <div className={ styles.messagesNotRead }>
                            <span>1</span>
                          </div> */ }
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

export default ContacsList;