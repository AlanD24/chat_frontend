import Image from "next/image";
import styles from "../styles/Chat.module.scss";
import { MessageModel } from "@/models/Message.model";
import { hourMonth } from "@/helpers/hourMonth";

export default function IncomingMsg({ msg }: { msg: MessageModel}) {

    const date = hourMonth( msg.createdAt );

    return (
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

            <div className={ styles.twoRows }>
                <div className={styles.incomingMsg_Text}>
                    <p>{ msg.message }</p>
                </div>
                <p className={ styles.dateHover}>
                    { date }
                </p>
            </div>
        </div>
    )
}