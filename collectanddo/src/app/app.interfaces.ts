namespace interfaces {
    export interface EnvOptions {
        hasura_secure: boolean;
        hasura_url: string;
        auth_token: string;
        jwt_server: string;
        jwt_path: string;
    }
}
