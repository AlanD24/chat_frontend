import React, { useEffect, useState } from "react";
import styles from "../styles/Chat.module.scss";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import TelegramIcon from "@mui/icons-material/Telegram";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para la función setOpen del padre
  iconName: string;
  setIconName: React.Dispatch<React.SetStateAction<string>>;
}

const SideNavOpts: React.FC<ChildProps> = ({
  setOpen,
  iconName,
  setIconName,
}) => {
  const [activeIcon, setActiveIconLocal] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setActiveIconLocal(iconName);
  }, [iconName, setActiveIconLocal]);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={styles.sideNavOpts}>
      <div className="icons">
        <div className={`
            ${styles.icon} 
            ${activeIcon == "messagesIcon" ? styles.active : ""}
        `}>
          <TelegramIcon
            onClick={() => setIconName("messagesIcon")}
            className={`${styles.sideIcon}`}
          />
        </div>

        <div
          className={`${styles.icon} 
          ${ darkMode ? styles.darkModeActive : styles.iconDark }
        `}>
          <DarkModeSharpIcon
            onClick={() => setDarkMode(!darkMode)}
            className={`${styles.sideIcon}`}
          />
        </div>
      </div>

      <div className="icons">
        <div
          className={`${styles.icon} ${styles.logoutIcon}
          ${ activeIcon == "logoutIcon" ? styles.active : "" }
        `}>
          <LogoutSharpIcon
            onClick={() => {
              setIconName("logoutIcon");
              handleOpen();
            }}
            className={`${styles.sideIcon}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SideNavOpts;
