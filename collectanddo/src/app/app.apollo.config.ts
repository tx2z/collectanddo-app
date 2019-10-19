import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

// Apollo
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { getOperationAST } from 'graphql';
import { WebSocketLink } from 'apollo-link-ws';

import { Auth0Service } from './services/auth0.service';

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
        private auth: Auth0Service
        ) {

        this.getToken().then(token => {

            const hasura_url = 'collectanddo.herokuapp.com/v1/graphql';
            const authorization = token ? `Bearer ${token}` : null;
            const headers = new HttpHeaders().append('Authorization', authorization);

            const uri = 'https://' + hasura_url;
            const http = this.httpLink.create({ uri, headers });

            const ws = new WebSocketLink({
                uri: 'wss://' + hasura_url,
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
        });
    }

    private getToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth.getIdTokenClaims$().pipe().subscribe(idToken => {
                resolve(idToken.__raw);
            });
        });
    }

}
