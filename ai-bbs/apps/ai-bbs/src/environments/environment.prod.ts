import { Environment } from '../interfaces';

export const environment: Environment = {
    production: true,
    apiUrl: 'http://localhost:4200',
    openAi: {
        apiKey: '',
        orgId: '',
        engineId: 'gpt-3.5-turbo',
    }
};