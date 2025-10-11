
export const getBaseUrl = () => {
    // Vite exposes DEV and MODE on import.meta.env
        return `${window.location.protocol}//api.${window.location.host}`
    // return envUrl;
};
