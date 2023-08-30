import { useContext, useEffect, useState } from "react";
import styles from '../../styles/Chat.module.scss';
import '../../styles/globals.css';
import SideNavOpts from "@/components/SideNavOpts";
import ContacsList from "@/components/ContacsList";
import Messages from "@/components/Messages";
import { Box, Modal, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import { ChatContext } from "@/context/chat/ChatContext";
import { types } from "@/types/types";
import EditUserInfo from "@/components/EditUserInfo";

const BoxStyles = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    border: 'none',
    outline: 'none',
    borderRadius: '10px'
};

export default function ChatPage() {

    // States to save/update data
    const [open, setOpen] = useState(false);
    const [iconName, setIconName] = useState("messagesIcon");
    const [ editUserInfo, setEditUserInfo] = useState<boolean>(false);
    const { dispatch } = useContext( ChatContext );

    // Use nextjs router
    const router = useRouter();

    const checkToken = () => {
        const userToken = localStorage.getItem('token');

        if(!userToken || userToken === '')
            router.push('/');
    }

    // When close modal
    const handleClose = () => {
        setOpen(false);
        setIconName('messagesIcon');
    }

    const logout = () => {
        clearChatState();
        localStorage.removeItem('token');
        router.reload();
    }

    const clearChatState = () => {
        dispatch({ type: types.clearChatState });
    }

    const handleChildButtonClick = (value: boolean) => {
        // Receive data from child component
        setEditUserInfo(value);
    };

    // Check token once it loads for first time
    useEffect(() => {
        checkToken();
    }, []);

    return <div className={ styles.chatContainer }>
        {/* Buttons of sidenav */}
        <SideNavOpts 
            setOpen={setOpen} 
            iconName={iconName} 
            setIconName={setIconName}
        ></SideNavOpts>

        {/* Users contact list */}
        <ContacsList showEditComponent={ handleChildButtonClick }></ContacsList>

        {/* Chat messages */}
        {
            editUserInfo ?
                <EditUserInfo></EditUserInfo>
            :
                <Messages></Messages>
        }

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={BoxStyles}>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', fontWeight: '600' }}>
                    Logging out
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }} style={{ textAlign: 'center' }}>
                    Are you sure you want to log out?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                    <Button variant="contained" className={ styles.cancelBtn } onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color='error' onClick={ logout }>
                        Logout
                    </Button>
                </Stack>
            </Box>
        </Modal>
    </div>
}