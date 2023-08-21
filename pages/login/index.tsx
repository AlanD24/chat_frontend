import styles from '../../styles/Login.module.scss';
import '../../styles/globals.css';
import Image from 'next/image';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { AuthContext } from '@/auth/AuthContext';
import { fetchWithoutToken } from '@/helpers/fetch';

type StateUpdateFunctions = {
    [key: string]: Dispatch<SetStateAction<string>>;
};

export default function LoginPage() {

    // useState for inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Show or hide passwordS
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Use nextjs router
    const router = useRouter();

    // Use authContext
    const { login } = useContext( AuthContext );

    // Do dynamic changes in inputs value
    const stateUpdateFunctions: StateUpdateFunctions = {
        email: setEmail,
        password: setPassword
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

    async function doLoggin(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        // Prevent reload page
        e.preventDefault();

        // Validate inputs
        const isEmailValid = validateEmail();
        if(!isEmailValid) return;

        const isPasswordValid = validatePassword();
        if(!isPasswordValid) return;
        
        try {
            // Send petition to backend (using our authContext)
            const response = await login(email, password);

            // If succeed, show toast and save token
            if(response.user && response.token) {
                toast.success('Login succesfully');
                saveToken(response.token);
                
                setTimeout(() => {
                    router.reload();
                }, 1500);
            } else
                toast.error('Ups! Could not log in');
        } catch (error) {
            toast.error('Ups! Could not log in');
        }
    }

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

    function validatePassword(): boolean {
        let isValid: boolean = true;

        if(password == '') {
            toast.error('Enter a password');
            isValid = false;
        }

        return isValid;
    }

    function saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    return <div className={styles.limiter}>
        <div className={styles.loginContainer}>
        
            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={ doLoggin }>
                    <div className={styles.imageContainer}>
                        <Image 
                            className={styles.userImage} 
                            src='/user.png' 
                            alt='user' 
                            width={100} 
                            height={100}
                            priority={true}
                        ></Image>
                    </div>

                    <span className={styles.formTitle}>
                        Login
                    </span>
                    
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
                            autoComplete="username"
                        />
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <FormControl variant="outlined" className={styles.passwordInput}>
                            <OutlinedInput
                                className={styles.passwordOutlinedInput}
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                name="password"
                                value={ password }
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
                                autoComplete="current-password"
                            />
                            <InputLabel 
                                className={`${styles.passwordLabel} ${password.length > 0 ? styles.noMargin : ''}`}
                            >
                                Password
                            </InputLabel>
                        </FormControl>
                    </div>

                    <div className={styles.btnContainer}>
                        <button type="submit">
                            Submit
                        </button>
                    </div>
                    
                    <div className={styles.lastOptsContainer}>
                        <div className={styles.columnOption}>
                            <input className="input-checkbox100" id="ckb1" type="checkbox" name="hasToRemember" />
                            <label className="label-checkbox100">
                                Remember me
                            </label>
                        </div>

                        <div className={styles.columnOption}>
                            <a href="/create-account">
                                Don't have account?
                            </a>
                        </div>
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
            </div>
        </div>
    </div>
}