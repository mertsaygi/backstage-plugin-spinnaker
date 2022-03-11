import { SpinnakerApi, spinnakerApiRef } from './api';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  identityApiRef
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const spinnakerPlugin = createPlugin({
  id: 'spinnaker',
  apis: [
    createApiFactory({
      api: spinnakerApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef, configApi: configApiRef },
      factory: ({ configApi }) => {
        return new SpinnakerApi({ 
          spinnakerConfig: configApi.getConfig('spinnaker'), 
        });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});
