import styles from '../../styles/Login.module.scss';
import '../../styles/globals.css';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';

type StateUpdateFunctions = {
    [key: string]: Dispatch<SetStateAction<string>>;
};

export default function Login() {

    // useState for inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Show or hide passwordS
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Do dynamic changes in inputs value
    const stateUpdateFunctions: StateUpdateFunctions = {
        email: setEmail,
        password1: setPassword
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

    function doLoggin(): void {
        console.log('do loggin');
    }

    return <div className={styles.limiter}>
        <div className={styles.loginContainer}>
        
            <div className={styles.formContainer}>
                <form className={styles.form}>
                    <Image className={styles.userImage} src='/user.png' alt='user' width={100} height={100}></Image>

                    <span className={styles.formTitle}>
                        Login
                    </span>
                    
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
                            />
                            <InputLabel className={styles.passwordLabel}>Password</InputLabel>
                        </FormControl>
                    </div>

                    <div className={styles.btnContainer}>
                        <button onClick={() => doLoggin()}>
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
                </form>
            </div>
        </div>
    </div>
}