import Image from "next/image";
import styles from "../styles/Chat.module.scss";
import { MessageModel } from "@/models/Message.model";
import { hourMonth } from "@/helpers/hourMonth";

export default function OutgoingMessage({ msg }: { msg: MessageModel}) {

    const date = hourMonth( msg.createdAt );

    return (
        <div className={styles.outgoingMsg}>
            <div className={styles.outgoingMsg_Text}>
                <p>{ msg.message }</p>
                {/* <p>{ date }</p> */}
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