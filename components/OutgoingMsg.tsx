import Image from "next/image";
import styles from "../styles/Chat.module.scss";
import { MessageModel } from "@/models/Message.model";
import { hourMonth } from "@/helpers/hourMonth";
import { useDarkModeContext } from "@/context/DarkModeContext";

export default function OutgoingMessage({ msg, image }: { msg: MessageModel, image: string}) {

    const date = hourMonth( msg.createdAt );
    const { isDarkMode } = useDarkModeContext();

    return (
        <div className={styles.outgoingMsg}>
            <div className={ styles.twoRows }>
                <div 
                    className={`${styles.outgoingMsg_Text} ${isDarkMode && styles.outgoingMsg_TextDark}`}

                >
                    <p>{ msg.message }</p>
                </div>
                    <p className={`${styles.dateHover} ${isDarkMode && styles.dateHoverDark}`}>
                        { date }
                    </p>

            </div>

            <div className="outgoingMsg_image">
                <Image
                className={styles.userImage}
                src={image != "" ? image : "/user.png"}
                alt="userImg"
                width={40}
                height={40}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                ></Image>
            </div>
        </div>
    )
}