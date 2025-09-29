
export const getBaseUrl = () => {
    // Vite exposes DEV and MODE on import.meta.env
    const envUrl = import.meta.env.VITE_SM_DEV == "DEV"
        ? 'http://localhost:8000' : window.location.origin
    return envUrl;
};
