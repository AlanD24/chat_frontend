import styles from "@/styles/Chat.module.scss";

export default function NoMessages() {

    return (
        <div className={ styles.noMsgsContainer }>
            <p>There are no messages</p>
            <p>in this chat yet</p>
        </div>
    )
}