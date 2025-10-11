
export const getBaseUrl = () => {
    // Vite exposes DEV and MODE on import.meta.env
    const envUrl = import.meta.env.DEV 
        ? 'https://localhost' : window.location.origin
    return envUrl;
};
