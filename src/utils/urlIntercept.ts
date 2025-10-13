import { appendFile } from "fs";

export const getBaseUrl = () => {
    
        return `${window.location.protocol}//${(import.meta.env.DEV) ? "api." : ""}${window.location.host}`
    // return envUrl;
};
