export interface Environment {
    production: boolean;
    apiUrl: string;
    openAi: {
        apiKey: string;
        orgId: string;
        engineId: string;
    }
}

