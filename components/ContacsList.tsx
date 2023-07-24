import React, { useState } from "react";
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

export default function ContacsList() {

  // useState for inputs
  const [search, setSearch] = useState("");

  // Executed every time an input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get inputName and inputValue from event
    const { name, value } = e.target;

    // Reject in case event.target would not be an object
    if (typeof name !== "string") return;

    // Set search
    setSearch(value);
  };

  return (
    <div className={styles.recentChats}>
      {/* User data begins */}
      <div className={styles.userData}>
        <Image
          className={styles.userImage}
          src="/luffy_wano.jpg"
          alt="userImg"
          width={70}
          height={70}
          style={{ objectFit: "cover" }}

        ></Image>
        <div className={styles.userName}>
          <h3>Monkey D Luffy</h3>
          <p>Strawhat's pirates captain</p>
        </div>
        <div className={styles.editIcon}>
          <EditIcon></EditIcon>
        </div>
      </div>
      {/* User data ends */}

      {/* Searchbox begins */}
      <div className={styles.searchContainer}>
        <FormControl variant="outlined" className={styles.searchBar}>
          <OutlinedInput
            className={styles.searchInput}
            type="text"
            label="search"
            name="search"
            value={search}
            onChange={handleInputChange}
            style={{ borderRadius: '30px' }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="start"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <InputLabel className={`${styles.searchLabel}`}>
            Search
          </InputLabel>
        </FormControl>
      </div>
      {/* Searchbox ends */}

      {/* Sidebar begins */}
      <div className={ styles.conversations }>
        {/* Active conversations begins */}
        <div className={ `${styles.activeUser}` }>
            <div className={ styles.activeUserImg }>
              <Image
                src="/sanji_smiling.jpg"
                alt="userImg"
                width={70}
                height={70}
                style={{ borderRadius: '50%', objectFit: "cover" }}
              ></Image>
            </div>
            <div className={ styles.activeUserData }>
                <div className={ styles.innerUserData }>
                    <h5>Vinsmoke Sanji</h5>
                    <span className={ styles.deliverMessage }>6:13 pm</span>
                </div>
                <div className={ styles.innerUserData }>
                  <p>Lorem ipsum dolor sit amet agaga adipisicing elit.</p>
                </div>
            </div>
        </div>

        <div className={ styles.activeUser }>
            <div className={ styles.activeUserImg }>
              <Image
                src="/chopper.webp"
                alt="userImg"
                width={70}
                height={70}
                style={{ borderRadius: '50%', objectFit: "cover" }}
              ></Image>
            </div>
            <div className={ styles.activeUserData }>
                <div className={ styles.innerUserData }>
                    <h5>Tony Tony Chopper</h5>
                    <span className={ styles.deliverMessage }>10:54 pm</span>
                </div>
                <div className={ styles.innerUserData }>
                    <p>Lorem ipsum dolor sit amet agaga adipisicing elit.</p>
                    <div className={ styles.messagesNotRead }>
                        <span>1</span>
                    </div>
                </div>
            </div>
        </div>

        <div className={ styles.activeUser }>
            <div className={ styles.activeUserImg }>
              <Image
                src="/zorojuro.jpg"
                alt="userImg"
                width={70}
                height={70}
                style={{ borderRadius: '50%', objectFit: "cover" }}
              ></Image>
            </div>
            <div className={ styles.activeUserData }>
                <div className={ styles.innerUserData }>
                    <h5>Roronoa Zoro</h5>
                    <span className={ styles.deliverMessage }>9:14 pm</span>
                </div>
                <div className={ styles.innerUserData }>
                    <p>Lorem ipsum dolor sit amet agaga adipisicing elit.</p>
                    <div className={ styles.messagesNotRead }>
                        <span>3</span>
                    </div>
                </div>
            </div>
        </div>
        {/* Active conversation ends */}

        {/* Inactive conversations begins */}
        <div className={styles.inactiveConversations}>
        </div>
        {/* Inactive conversations ends */}

        {/* Extra space for scroll */}
        <div className="extra_space"></div>
      </div>
      {/* Sidebar ends */}
    </div>
  );
}
