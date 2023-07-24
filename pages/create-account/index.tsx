import styles from '../../styles/Login.module.scss';
import '../../styles/globals.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Create, Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext, AuthProvider } from '@/auth/AuthContext';

export interface formInputs {
    email: Object;
    password1: Object;
    password2: Object;
}

type StateUpdateFunctions = {
    [key: string]: Dispatch<SetStateAction<string>>;
};

export function CreateAccount() {

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

    // Use authContext
    const { createAccount } = useContext( AuthContext );

    // Redirect to login
    const redirectToLogin = () => {
        router.push('/');
    }

    // Do dynamic changes in inputs value
    const stateUpdateFunctions: StateUpdateFunctions = {
        name: setName,
        email: setEmail,
        password1: setPassword1,
        password2: setPassword2
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

    function saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    async function createUserAccount(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        // Prevent reload page
        e.preventDefault();

        // Validate inputs
        const isNameValid = validateName();
        if(!isNameValid) return;

        const isEmailValid = validateEmail();
        if(!isEmailValid) return;

        const arePasswordsValid = validatePasswords();
        if(!arePasswordsValid) return;

        try {
            // Send petition to backend (using our authContext)
            const response = await createAccount(email, name, password1, password2);
            
            // If succeed, show toast and save token
            if(response.user && response.token) {
                toast.success('Account created!');
                saveToken(response.token);
                
                setTimeout(() => {
                    router.push('/chat');
                }, 1500);
            } else
                toast.error('Ups! Your account could not be created');
        } catch (error) {
            toast.error('Ups! Your account could not be created');
        }
    }

    function validateName(): boolean {
        let isValid: boolean = true;

        if(name == '') {
            toast.error('Name is necessary');
            isValid = false;
        }

        return isValid;
    }

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if(userToken)
            router.push('/chat');
    }, []);

    function validateEmail(): boolean {
        let isValid: boolean = true;

        if(email == '' || !isValidEmail(email)) {
            toast.error('Email is not valid');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
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
                {/* Form begins */}
                <form className={styles.form} onSubmit={ createUserAccount }>
                    {/* Back to login icon */}
                    <div className={styles.backToLogin}>
                        <ArrowBackIcon 
                            className={styles.backArrow}
                            onClick={ redirectToLogin }
                        />
                    </div>
                    {/* /Back to login icon */}

                    {/* Image */}
                    <div className={styles.imageContainer}>
                        <Image 
                            className={styles.userImage} 
                            src='/luffy_wano.jpg'
                            alt='userImg' 
                            width={100} 
                            height={100}
                            objectFit="cover"
                        ></Image>
                    </div>
                    {/* /Image */}

                    <span className={styles.formTitle}>
                        Create account
                    </span>

                    {/* Name field */}
                    <div className={styles.inputContainer}>
                        <TextField
                            className={`${styles.fullWidthInput} ${name.length > 0 ? styles.hasContent : ''}`}
                            label="Name" 
                            variant="outlined"
                            type="text" 
                            name="name" 
                            placeholder="Enter your name and lastname"
                            value={name}
                            onChange={ handleInputChange }
                            autoComplete='userName'
                        />
                    </div>
                    {/* /Name field */}
                    
                    {/* Email field */}
                    <div className={styles.inputContainer}>
                        <TextField
                            className={`${styles.fullWidthInput} ${email.length > 0 ? styles.hasContent : ''}`}
                            label="Email" 
                            variant="outlined"
                            type="text" 
                            name="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={ handleInputChange }
                            autoComplete='userEmail'
                        />
                    </div>
                    {/* /Email field */}
                    
                    {/* Password 1 field */}
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
                                autoComplete='new-password'
                            />
                            <InputLabel 
                                className={`${styles.passwordLabel} ${password1.length > 0 ? styles.noMargin : ''}`}
                            >
                                Password
                            </InputLabel>
                        </FormControl>
                    </div>
                    {/* /Password 1 field */}
                    
                    {/* Password 2 field */}
                    <div className={styles.inputContainer}>
                        <FormControl variant="outlined" className={styles.passwordInput}>
                            <OutlinedInput
                                className={styles.passwordOutlinedInput}
                                type={showPassword2 ? 'text' : 'password'}
                                label="Repeated password"
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
                                autoComplete='new-password-confirm'
                            />
                            <InputLabel 
                                className={`${styles.passwordLabel} ${password2.length > 0 ? styles.noMargin : ''} ${styles.customLabel}`}
                            >
                                Repeat pass
                            </InputLabel>
                        </FormControl>
                    </div>
                    {/* Password 2 field */}

                    <div className={styles.btnContainer}>
                        <button type='submit'>
                            Submit
                        </button>

                        {/* Show toasts */}
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
                        {/* /Show toasts */}
                    </div>
                </form>
                {/* Form ends */}
            </div>
        </div>
    </div>
}

export default function NewAccount(props: any) {
    return (
        <AuthProvider>
            <CreateAccount {...props}></CreateAccount>
        </AuthProvider>
    )
}