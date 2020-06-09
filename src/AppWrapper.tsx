import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient, { InMemoryCache, NormalizedCacheObject } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import App from './App';

const AppWrapper = () => {
  const [client, setClient] = useState<ApolloClient<unknown>>();

  useEffect(() => {
    const cache = new InMemoryCache();
    const client = new ApolloClient({
      cache,
      uri: 'https://countries-274616.ew.r.appspot.com',
    });
    persistCache({
      cache,
      storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>
    }).then(() => {
      setClient(client);
    })
  }, []);

  if (!client) return <h1>Loading app...</h1>
  return (
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  );
};

export default AppWrapper;