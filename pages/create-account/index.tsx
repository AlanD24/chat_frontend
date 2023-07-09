import styles from '../../styles/Login.module.scss';
import '../../styles/globals.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';

export interface formInputs {
    email: Object;
    password1: Object;
    password2: Object;
}

type StateUpdateFunctions = {
    [key: string]: Dispatch<SetStateAction<string>>;
};

export default function CreateAccount() {

    // useState for inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    // Show or hide passwordS
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [showPassword2, setShowPassword2] = useState(false);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Use nextjs router
    const router = useRouter();

    // Do dynamic changes in inputs value
    const stateUpdateFunctions: StateUpdateFunctions = {
        name: setName,
        email: setEmail,
        password1: setPassword1,
        password2: setPassword2
    }

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
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

    async function createAccount(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        // Prevent reload page
        e.preventDefault();

        // Validate inputs
        const isNameValid = validateName();
        if(!isNameValid) return;

        const isEmailValid = validateEmail();
        if(!isEmailValid) return;

        const arePasswordsValid = validatePasswords();
        if(!arePasswordsValid) return;

        // Send data and set url of petition
        const dataToSend = JSON.stringify({ name, email, password1, password2 });
        const url = 'http://localhost:8080/api/auth/create-user';

        // Send petition to backend
        const response = await fetch(url, {
            method: 'POST',
            body: dataToSend,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const finalRes = await response.json();

        // If succeed
        if(finalRes.user && finalRes.token) {
            toast.success('Account created!');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } else
            toast.error('Ups! Your account could not be created');
    }

    function validateName(): boolean {
        let isValid: boolean = true;

        if(name == '') {
            toast.error('Name is necessary');
            isValid = false;
        }

        return isValid;
    }

    function validateEmail(): boolean {
        let isValid: boolean = true;

        if(email == '' && !isValidEmail(email)) {
            toast.error('Email is not valid');
            isValid = false;
        }

        return isValid;
    }

    function validatePasswords(): boolean {
        let isValid: boolean = true;

        if(password1 == '') {
            toast.error('Enter a password');
            isValid = false;
        }

        if(password2 == '') {
            toast.error('Enter your repeated password');
            isValid = false;
        }
        if(!isValid) return isValid;

        if(password1.length < 6 || password2.length < 6) {
            toast.error('Passwords needs 6 minimun character');
            isValid = false;
        }
        if(!isValid) return isValid;

        if(password1 !== password2) {
            toast.error('Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    return <div className={styles.limiter}>
        <div className={styles.loginContainer}>
        
            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={createAccount}>
                    <Image className={styles.userImage} src='/user.png' alt='userImg' width={100} height={100}></Image>

                    <span className={styles.formTitle}>
                        Create account
                    </span>

                    <div className={styles.inputContainer}>
                        <TextField
                            className={styles.fullWidthInput}
                            label="Name" 
                            variant="outlined"
                            type="text" 
                            name="name" 
                            placeholder="Enter your name and lastname"
                            value={name}
                            onChange={ handleInputChange }
                        />
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <TextField
                            className={styles.fullWidthInput}
                            label="Email" 
                            variant="outlined"
                            type="text" 
                            name="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={ handleInputChange }
                        />
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <FormControl variant="outlined" className={styles.passwordInput}>
                            <OutlinedInput
                                className={styles.passwordOutlinedInput}
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                name="password1"
                                value={ password1 }
                                onChange={ handleInputChange }
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            <InputLabel className={styles.passwordLabel}>Password</InputLabel>
                        </FormControl>
                    </div>

                    <div className={styles.inputContainer}>
                        <FormControl variant="outlined" className={styles.passwordInput}>
                            <OutlinedInput
                                className={styles.passwordOutlinedInput}
                                type={showPassword2 ? 'text' : 'password'}
                                label="Password"
                                name="password2"
                                value={ password2 }
                                onChange={ handleInputChange }
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword2}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            <InputLabel className={styles.passwordLabel}>Repeat pass</InputLabel>
                        </FormControl>
                    </div>

                    <div className={styles.btnContainer}>
                        <button type='submit'>
                            Submit
                        </button>
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
                    </div>
                </form>
            </div>
        </div>
    </div>
}