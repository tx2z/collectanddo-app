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
import { environment } from 'src/environments/environment';


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
        ) {

        const token = this.authService.userToken;
        const authorization = token ? `Bearer ${token}` : null;
        const headers = new HttpHeaders().append('Authorization', authorization);

        const hasura_headers: any = {
            'X-Hasura-Access-Key': environment.HASURA_KEY,
            'X-HASURA-USER-ID': '1',
            'X-HASURA-ROLE': 'user',
        };

        const uri = 'http://' + environment.HASURA_URL;
        const http = this.httpLink.create({ uri, headers });
        /*
        const http = this.httpLink.create({
            uri: uri,
            headers: hasura_headers
        });
        */

        const ws = new WebSocketLink({
            uri: 'ws://' + environment.HASURA_URL,
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
