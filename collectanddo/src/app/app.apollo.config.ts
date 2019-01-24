import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';

// Apollo
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { getOperationAST } from 'graphql';
import { WebSocketLink } from 'apollo-link-ws';
import { StorageEnvService } from './services/storage-env.service';

@NgModule({
    exports: [
        HttpClientModule,
        ApolloModule,
        HttpLinkModule
    ]
})
export class GraphQLModule {
    constructor(
        private apollo: Apollo,
        private httpLink: HttpLink,
        private authService: AuthService,
        private storageEnv: StorageEnvService
        ) {

        const envOptions: interfaces.EnvOptions = storageEnv.getOptions();
        const token = this.authService.userToken;
        const authorization = token ? `Bearer ${token}` : null;
        const headers = new HttpHeaders().append('Authorization', authorization);

        const uri = (envOptions.hasura_secure ? 'https://' : 'http://') + envOptions.hasura_url;
        const http = this.httpLink.create({ uri, headers });

        const ws = new WebSocketLink({
            uri: (envOptions.hasura_secure ? 'wss://' : 'ws://') + envOptions.hasura_url,
            options: {
                reconnect: true,
                connectionParams: {
                    headers: {
                        Authorization: authorization
                    }
                }
            }
        });


        // create Apollo
        this.apollo.create({
            link: ApolloLink.split(
                operation => {
                    const operationAST = getOperationAST(operation.query, operation.operationName);
                    return !!operationAST && operationAST.operation === 'subscription';
                },
                ws,
                http,
            ),
            cache: new InMemoryCache()
        });
    }
}
