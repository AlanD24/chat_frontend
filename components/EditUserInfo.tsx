import toast, { Toaster } from 'react-hot-toast';
import styles from '../styles/EditInfo.module.scss';
import Image from 'next/image';
import { TextField } from '@mui/material';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/AuthContext';
import { ChatContext } from '@/context/chat/ChatContext';
import { UserModel } from '@/models/User.model';
import { useRouter } from 'next/router';
import { useDarkModeContext } from '@/context/DarkModeContext';

type StateUpdateFunctions = {
    [key: string]: Dispatch<SetStateAction<string>>;
};

export default function EditUserInfo() {

    // useState for inputs
    const [userName, setUserName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [hasLoad, setHasLoad] = useState<boolean>(false);
    const [avatarSrc, setAvatarSrc] = useState<string>("/user.png");
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    // Retrieve data of user
    const { chatState } = useContext( ChatContext );
    const { auth } = useContext( AuthContext );
    const { _id } = auth;

    // Use nextjs router
    const router = useRouter();

    // Use authContext
    const { updateUserInfo } = useContext( AuthContext );

    // Check dark mode context
    const { isDarkMode } = useDarkModeContext();

    // Do dynamic changes in inputs value
    const stateUpdateFunctions: StateUpdateFunctions = {
        name: setUserName,
        description: setDescription
    }

    // Executed every time an input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Get inputName and inputValue from event
        const { name, value } = e.target;

        // Reject in case event.target would not be an object
        if (typeof name !== 'string') return;

        // Change value dynamically for inputs
        const updateState = stateUpdateFunctions[name];
        if (updateState) updateState(value);
    }

    const checkUserLogged = (_id: string, chatState: any) => {
        const users = chatState?.users;

        users.forEach((user: UserModel) => {
            if(user._user === _id) {
                setHasLoad(true);
                setUserName(user.name);
                setDescription(user.description);
            }
        });
    }

    const editUserInfo = async(e: React.FormEvent<HTMLFormElement>) => {
        // Prevent reload page
        e.preventDefault();
        
        // Validate inputs
        const isValidUserName = validateUserName();
        if( !isValidUserName ) return;
        
        try {
            // Send petition to backend (using our authContext)
            let response;
            const formData = new FormData();
            
            formData.append('name', userName);
            formData.append('description', description);
            if(selectedFile) {
                formData.append('avatar', selectedFile);
            }
            
            response = await updateUserInfo( _id, formData );
            // If succeed, show toast and save token
            if(response.user && response.token) {
                toast.success('User info updated correctly');
                setTimeout(() => {
                    router.reload();
                }, 1500);
            } else
                toast.error('Ups! Could not update your info');
        } catch (error) {
            toast.error('Ups! Could not update your info');
        }
    }
    
    const validateUserName = (): boolean => {
        let isValid: boolean = true;

        if( userName === '' ) {
            toast.error('Name is not valid');
            isValid = false;
        }

        return isValid;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        setSelectedFile(file);
    }

    useEffect(() => {
        checkUserLogged( _id, chatState );
    }, [ _id, chatState ]);

    useEffect(() => {
        const getAvatar = async(): Promise<void> => {
            const imageUrl: string = `http://localhost:8080/uploads/${auth.image}`;
            setAvatarSrc(imageUrl);
        }

        if(auth.image) {
            getAvatar();
        }
    }, [ auth ]);

    return <div className={ `${styles.editUserContainer} ${isDarkMode && styles.editUserContainerDark}` }>
        <div className={ `${styles.editInfoForm} ${isDarkMode && styles.editInfoFormDark}` }>
            { hasLoad && (
                <form className={styles.form} onSubmit={ editUserInfo } encType="multipart/form-data">
                    <div className={styles.imageContainer}>
                        <Image 
                            className={styles.userImage} 
                            src={ avatarSrc ? avatarSrc : "/user.png" }
                            alt='user' 
                            width={100} 
                            height={100}
                            priority={true}
                        ></Image>
                    </div>

                    <span className={`${styles.formTitle} ${isDarkMode && styles.formTitleDak}`}>
                        Edit user&#39;s info
                    </span>
                        
                    <div className={`${styles.inputContainer} ${isDarkMode && styles.inputContainerDark}`}>
                        <TextField
                            className={`${styles.fullWidthInput} 
                                ${userName.length > 0 ? styles.hasContent : ''}
                                ${isDarkMode && styles.textFieldDark}
                            `}
                            label="Name" 
                            variant="outlined"
                            type="text" 
                            name="name" 
                            value={ userName }
                            onChange={ handleInputChange }
                            autoComplete="username"
                        />
                    </div>

                    <div className={`${styles.inputContainer} ${isDarkMode && styles.inputContainerDark}`}>
                        <TextField
                            className={`${styles.fullWidthInput} 
                                ${description.length > 0 ? styles.hasContent : ''}
                                ${isDarkMode && styles.textFieldDark}
                            `}
                            label="Description" 
                            variant="outlined"
                            type="text" 
                            name="description" 
                            value={ description }
                            onChange={ handleInputChange }
                            autoComplete="description"
                        />
                    </div>

                    <div className={ `${styles.fileInputContainer} ${isDarkMode && styles.fileInputContainerDark}` }>
                        <input
                            type="file"
                            onChange={ handleChange }
                        />
                    </div>

                    <div className={`${styles.btnContainer} ${isDarkMode && styles.btnContainerDark}`}>
                        <button type="submit">
                            Submit
                        </button>
                    </div>

                    <Toaster
                        toastOptions={{
                            success: {
                                style: {
                                    color: 'green',
                                },
                            },
                            error: {
                                style: {
                                    color: 'red',
                                },
                            },
                        }}
                    />
                </form>
            )}
        </div>
    </div>
}