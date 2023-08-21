import Image from "next/image";
import styles from "../styles/Chat.module.scss";
import { MessageModel } from "@/models/Message.model";
import { hourMonth } from "@/helpers/hourMonth";
import { useState } from "react";

export default function OutgoingMessage({ msg }: { msg: MessageModel}) {

    const date = hourMonth( msg.createdAt );
    const [ showDate, setShowDate ] = useState<boolean>(false);

    return (
        <div className={styles.outgoingMsg}>
            <div className={ styles.twoRows }>
                <div 
                    className={styles.outgoingMsg_Text}

                >
                    <p>{ msg.message }</p>
                </div>
                    <p className={ styles.dateHover }>
                        { date }
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
    )
}