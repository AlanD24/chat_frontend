import React, { useEffect, useState } from "react";
import styles from "../styles/Chat.module.scss";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useDarkModeContext } from "@/context/DarkModeContext";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Type for function setOpen of parent element
  iconName: string;
  setIconName: React.Dispatch<React.SetStateAction<string>>;
}

const SideNavOpts: React.FC<ChildProps> = ({
  setOpen,
  iconName,
  setIconName,
}) => {
  const [activeIcon, setActiveIconLocal] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();

  useEffect(() => {
    setActiveIconLocal(iconName);
  }, [iconName, setActiveIconLocal]);

  const handleOpen = () => {
    setOpen(true);
  };

  const setDarkMode = () => {
    toggleDarkMode();
  }

  return (
    <div className={`${styles.sideNavOpts} ${isDarkMode && styles.sideNavOptsDark}`}>
      <div className={styles.icons}>
        <div className={`
            ${styles.icon} 
            ${activeIcon == "messagesIcon" ? styles.active : ""}
            ${isDarkMode && styles.iconBgDark}
        `}>
          <TelegramIcon
            onClick={() => setIconName("messagesIcon")}
            className={`${styles.sideIcon}`}
          />
        </div>

        <div
          className={`${styles.icon} 
          ${ isDarkMode ? styles.darkModeActive : styles.iconDark }
        `}>
          <DarkModeSharpIcon
            onClick={setDarkMode}
            className={`${styles.sideIcon}`}
          />
        </div>
      </div>

      <div className={styles.icons}>
        <div
          className={`${styles.icon} ${styles.logoutIcon}
          ${ activeIcon == "logoutIcon" ? styles.active : "" }
          ${ isDarkMode && styles.iconBgDark }
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
