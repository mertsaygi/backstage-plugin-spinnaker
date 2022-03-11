export interface Config {
    spinnaker: {
        /**
         * Gate URL for Spinnaker Instance.
         * @visibility frontend
         */
        target: string;

        /**
         * Authentication options about Spinnaker
         * @visibility frontend
         */
        auth: {
            /** @visibility frontend */
            oauth2?: {
                /** @visibility frontend */
                authUrl?: string; 
                /** @visibility frontend */
                accessToken?: string;  
                /** @visibility frontend */
                expireDate?: string; 
                /** @visibility frontend */
                refreshToken?: string;  
                /** @visibility frontend */
                tokenType?: string; 
                /** @visibility frontend */
                clientId?: string;  
                /** @visibility frontend */
                clientSecret?: string; 
                /** @visibility frontend */
                tokenUrl?: string;  
                /** @visibility frontend */
                scopes?: string[];  
            };
        };
    }
}