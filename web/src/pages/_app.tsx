import { ChakraProvider } from '@chakra-ui/react';

import theme from '../theme';
import { AppProps } from 'next/app';
import { Provider, Client, fetchExchange } from 'urql';
import { QueryInput, cacheExchange, Cache } from '@urql/exchange-graphcache';
import {
    LoginMutation,
    MeDocument,
    MeQuery,
} from '../generated/graphql/graphql';

function fdUpdateQuery<Result, Query>(
    result: any,
    cache: Cache,
    input: QueryInput,
    fn: (res: Result, query: Query) => Query
) {
    return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}

const client = new Client({
    url: 'http://localhost:4000/graphql',
    exchanges: [
        cacheExchange({
            updates: {
                Mutation: {
                    login: (result: LoginMutation, args, cache, info) => {
                        fdUpdateQuery<LoginMutation, MeQuery>(
                            result,
                            cache,
                            {
                                query: MeDocument,
                            },
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },
                },
            },
        }),
        fetchExchange,
    ],
    fetchOptions: {
        credentials: 'include',
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider value={client}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
}

export default MyApp;
