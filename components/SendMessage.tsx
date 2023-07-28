import styles from "../styles/Chat.module.scss";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useContext, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { AuthContext } from "@/auth/AuthContext";
import { ChatContext } from "@/context/chat/ChatContext";

export default function SendMessage() {

  // useState for inputs
  const [message, setMessage] = useState("");
  const { socket } = useContext( SocketContext );
  const { auth } = useContext( AuthContext );
  const { chatState } = useContext( ChatContext );

  // Executed every time an input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get inputName and inputValue from event
    const { name, value } = e.target;

    // Reject in case event.target would not be an object
    if (typeof name !== "string") return;

    // Set search
    setMessage(value);
  };

  const sendMessage = (e: any) => {
    e.preventDefault(); // Don't refresh page

    if(message.length === 0) return;
    setMessage("");

    // Emit socket event to send message
    socket.emit( "personal-message", {
        from: auth._id,
        to: chatState.activeChat,
        message: message
    });
  }

  return (
    <div className={styles.endMessages}>
    <form 
      onSubmit={ sendMessage } 
      className={`${styles.formSendMessage} ${ chatState.activeChat == null && styles.hideDiv }`}
    >
      <FormControl 
        variant="outlined" 
        className={styles.sendMessageBar}
        >
        <OutlinedInput
          className={styles.searchInput}
          type="text"
          label="message"
          name="message"
          value={message}
          onChange={handleInputChange}
          style={{ borderRadius: "30px", paddingRight: "0" }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                edge="start"
                color="default"
                className={styles.sendMessage__icon}
                type="submit"
              >
                <SendIcon
                  style={{ height: "40px", width: "40px", paddingLeft: "5px" }}
                />
              </IconButton>
            </InputAdornment>
          }
        />
        <InputLabel
          className={`${styles.searchLabel}`}
          style={{ width: "150px" }}
        >
          Type something
        </InputLabel>
      </FormControl> 
    </form>
    </div>
  );
}
