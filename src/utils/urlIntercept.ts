export const getBaseUrl = () => {
    // Vite exposes DEV and MODE on import.meta.env
    const envUrl = (import.meta as any).env?.VITE_BACKEND_URL;
    if ((import.meta as any).env?.DEV) {
        return envUrl ?? 'http://localhost:8000';
    }
    return envUrl ?? 'https://home.nathanswanson.online';
};