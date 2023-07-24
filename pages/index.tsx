import { AuthContext, AuthProvider } from '@/auth/AuthContext';
import LoginPage from './login';
import { useContext, useEffect, useState } from 'react';
import ChatPage from './chat';
import { SocketProvider } from '@/context/SocketContext';

export function HomePage() {

  const [existToken, setExistToken] = useState(false);

  // Retrieve auth and verifyToken from AuthContext
  const { auth, verifyToken } = useContext( AuthContext );

  useEffect(() => {
    const changeAuthCheking = async(): Promise<boolean> => {
      const existToken: boolean = await verifyToken();
      setExistToken(existToken);
  
      return existToken;
    }

    changeAuthCheking();
  }, [verifyToken]);

  return (
    <div>
        { auth.checking ?
              <h1>Espere por favor...</h1>
          :
            <>
              { existToken ?
                  <ChatPage></ChatPage>
                :
                  <LoginPage></LoginPage>
              }
            </>
        }
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <HomePage />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App;