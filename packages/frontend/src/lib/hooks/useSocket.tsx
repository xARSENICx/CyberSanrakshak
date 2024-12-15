import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
const serverUrl= "http://localhost:3000/nextjs";
const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Ensure the socket connection is only established on the client
    if (!serverUrl) return;

    const socketInstance = io(serverUrl,
      
      {
        transports:["websocket"],
        auth:{adminEmail :"palash@gmail.com"},
      withCredentials: true, // Add options as necessary
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
