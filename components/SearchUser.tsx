import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/Chat.module.scss";
import { useContext, useEffect, useState } from "react";
import { UserModel } from "@/models/User.model";
import { ChatContext } from "@/context/chat/ChatContext";
import { types } from "@/types/types";
import { useDarkModeContext } from "@/context/DarkModeContext";

export default function SearchUser() {
  // useState for searchUserInput
  const [search, setSearch] = useState("");
  const [ usersCopy, setUsersCopy ] = useState<UserModel[]>([]);

  const { chatState, dispatch } = useContext( ChatContext );
  const { isDarkMode } = useDarkModeContext();

  // Copy all users in other arr
  useEffect(() => {
    setUsersCopy(chatState.users);
  }, [ chatState ]);

  // Executed every time an input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get inputName and inputValue from event
    const { name, value } = e.target;

    // Reject in case event.target would not be an object
    if (typeof name !== "string") return;

    if( value.length >= 1) {
        // Set search
        setSearch(value);

        // Find user in arr of usersCopy
        const results = searchByName( usersCopy, value );

        // Then use dispatch to real filter users
        dispatch({
            type: types.filterUsers,
            payload: results
        });
    } else {
        // Clean input
        setSearch("");
        
        // Restore original arr
        dispatch({
            type: types.filterUsers,
            payload: usersCopy
        });
    }
  };

  const searchByName = (arr: UserModel[], value: string) => {
    // Convert value to lowerCase; we'll have an insensitive comparative to upperCase
    const searchValue = value.toLowerCase();

    // Filter users using value
    let results: UserModel[] = [];
    for(let userObj of arr) {
        if(userObj.name.toLowerCase().includes( searchValue )) {
            results.push(userObj);
        }
    }
    return results;
  }

  return (
    <div className={styles.searchContainer}>
      <FormControl variant="outlined" className={ `${styles.searchBar} ${isDarkMode && styles.searchBarDark}`}>
        <OutlinedInput
          className={ `${styles.searchInput} ${isDarkMode && styles.searchInputDark}`}
          type="text"
          label="search"
          name="search"
          value={search}
          onChange={handleInputChange}
          style={{ borderRadius: "30px" }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton className={`${isDarkMode && styles.searchIconDark}`} aria-label="toggle password visibility" edge="start">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <InputLabel className={`${styles.searchLabel}`}>Search</InputLabel>
      </FormControl>
    </div>
  );
}
