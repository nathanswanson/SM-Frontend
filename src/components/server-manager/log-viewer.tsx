import { useEffect } from "react"


export const LogView = (containerName: string) => {
    useEffect(() => {
        if (!containerName) return;

        const logMessage = new EventSource(`http://localhost:8000/api/container/${containerName}/logs`)

        logMessage.onmessage = (event) => {
            console.log("Log: ", event.data);
        }

        logMessage.onerror = (error) => {
            console.error("EventSource failed:", error);
            logMessage.close();
        };

        return () => {
            logMessage.close();
        };
    }, [containerName]); 

    return <div>Streaming logs for {containerName}...</div>;
}

