import React, { useState } from "react";
import styles from "../styles/Chat.module.scss";
import Image from "next/image";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function Messages() {
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
      <div className={styles.midMessages}>
        {/* Sent messages begin */}
        <div className={styles.outgoingMsg}>
          <div className={styles.outgoingMsg_Text}>
            <p>
              Nullam lacinia placerat nisl. In maximus tortor in mauris ullamcorper dignissim. Morbi tortor tortor, tincidunt sit amet efficitur vitae, suscipit vel leo.
            </p>
          </div>
          <div className="outgoingMsg_image">
            <Image
              className={styles.userImage}
              src="/luffy_wano.jpg"
              alt="userImg"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            ></Image>
          </div>
        </div>

        <div className={styles.outgoingMsg}>
          <div className={styles.outgoingMsg_Text}>
            <p>
              Ut eu diam lacinia, tincidunt velit quis, elementum diam. Phasellus mattis posuere iaculis..
            </p>
          </div>
          <div className="outgoingMsg_image">
            <Image
              className={styles.userImage}
              src="/luffy_wano.jpg"
              alt="userImg"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            ></Image>
          </div>
        </div>
        {/* Sent messages end */}

        {/* Received messages begin */}
        <div className={styles.incomingMsg}>
          <div className="incomingMsg_image">
            <Image
              src="/sanji_smiling.jpg"
              alt="userImg"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            ></Image>
          </div>
          <div className={styles.incomingMsg_Text}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac elit risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ullamcorper velit orci, non scelerisque odio rhoncus at. 
            </p>
          </div>
        </div>
        {/* Received messages ends */}
      </div>
      {/* Container for messages ends */}

      {/* Send message div begins */}
      <div className={styles.endMessages}>
        <FormControl variant="outlined" className={ styles.sendMessageBar }>
          <OutlinedInput
            className={styles.searchInput}
            type="text"
            label="message"
            name="message"
            value={search}
            onChange={handleInputChange}
            style={{ borderRadius: "30px", paddingRight: '0' }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                aria-label="toggle password visibility"
                edge="start"
                color="default"
                className={ styles.sendMessage__icon }
                >
                    <SendIcon style={{ height: '40px', width: '40px', paddingLeft: '5px' }}/>
                </IconButton>
              </InputAdornment>
            }
          />
          <InputLabel className={`${styles.searchLabel}`} style={{ width: '150px'}}>Type something</InputLabel>
        </FormControl>
      </div>
      {/* Send message div ends */}
    </div>
  );
}
