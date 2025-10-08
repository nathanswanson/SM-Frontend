import { getBaseUrl } from "../utils/urlIntercept";
import { client as apiClient } from "./hey-api/client/client.gen";

apiClient.setConfig({
    baseUrl: getBaseUrl()
})

export const client = apiClient;