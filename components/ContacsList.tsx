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
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { useDarkModeContext } from "@/context/DarkModeContext";
import { useRouter } from "next/router";

interface ContactsListProps {
  showEditComponent: (value: boolean) => void;
}

const ContacsList: React.FC<ContactsListProps> = function({ showEditComponent }) {

  const [ users, setUsers ] = useState<UserModel[]>([]);
  const [ doLoad, setDoLoad ] = useState<boolean>(false);
  const [ avatarSrc, setAvatarSrc ] = useState("");
  const [ userHasImage, setUserHasImage ] = useState<boolean>(false);
  const [ hideUsersList, setHideUsersList ] = useState<boolean>(false);
  const [ showEdit, setShowEdit ] = useState<boolean>(false);

  const { width } = useWindowDimensions();

  const { chatState } = useContext( ChatContext );
  const { auth } = useContext( AuthContext );
  const { isDarkMode } = useDarkModeContext();
  const { _id } = auth;

  const { dispatch } = useContext( ChatContext );

  // Use nextjs router
  const router = useRouter();

  const setActiveChat = async (user: UserModel) => {
    if( width <= 500 ) {
      const dataToSend = { chatState, _id };
      // router.push({
      //   pathname: '/chatResponsive',
      //   query: { data: JSON.stringify(dataToSend) }
      // });
    }
    
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

    try {
      const result = await fetchWithToken( endpoint, "POST", data);

      // Set last messages to users list
      const updatedUsers = await setLastMessages( result, users );

      // Sort users list, according if they have last message
      const sortedUsers: UserModel[] = sortUsersList( updatedUsers.users );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching last messages:", error);
    }
  }

  const setLastMessages = async (result: any[], users: UserModel[]): Promise<any> => {
    return new Promise((res, rej) => {
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

      res({result, users});
    });
  }

  const sortUsersList = (usersList: UserModel[]): UserModel[] => {
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
    return usersList;
  }

  const handleEditInfo = () => {
    setShowEdit(!showEdit);
    showEditComponent(showEdit);
  }

  useEffect(() => {
    ( chatState?.usersCopy.length >= 1 )
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
      if(!auth.image || auth.image == undefined) {
        setUserHasImage(false);
        return;
      }

      const imageUrl: string = `http://localhost:8080/uploads/${auth.image}`;
      setAvatarSrc(imageUrl);
      setUserHasImage(true)
    }

    getAndSetAvatar();
  }, [ auth ]);

  return (
    <div className={` ${styles.recentChats} ${isDarkMode && styles.recentChatsDark}`}>
      {/* User data begins */}
      <div className={styles.userData}>
        <Image
          className={styles.userImage}
          src={ !userHasImage ? '/user.png' : avatarSrc }
          alt="userImg"
          width={70}
          height={70}
          style={{ objectFit: "cover" }}
          priority={ true }
        ></Image>

        <div className={`${styles.userName}  ${isDarkMode && styles.userNameDark}`}>
          <h3>{ auth.name }</h3>
          <p>{ auth?.description }</p>
        </div>
        <div 
          className={`${styles.editIcon} ${isDarkMode && styles.iconChatsDark}`}
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
      <div className={ `${styles.conversations} ${hideUsersList && styles.hideConversations}` }>
        {/* Users list begins */}
          { 
            (users.length >= 1 && doLoad ? 
                users.filter((user: any) => user._user != _id).map((user: UserModel) =>
                  <div 
                    className={ `${styles.activeUser} ${isDarkMode && styles.activeUserDark}` } 
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
                        <div className={ `${styles.innerUserData} ${isDarkMode && styles.userNameDark}` }>
                            <h5>{ user.name }</h5>
                            <span className={ styles.deliverMessage }>
                              { user?.hour }
                            </span>
                        </div>
                        {/* <div className={ `${styles.innerUserData} ${isDarkMode && styles.userNameDark}` }>
                          <p>
                            { user.lastMessage ?
                                user.lastMessage
                              :
                                'Be the first to say "Hi!"'
                            }
                          </p>
                        </div> */}
                          { /* <div className={ styles.messagesNotRead }>
                            <span>1</span>
                          </div> */ }
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