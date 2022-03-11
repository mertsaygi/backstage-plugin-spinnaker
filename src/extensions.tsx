import { spinnakerPlugin } from './plugin';
import { createComponentExtension } from '@backstage/core-plugin-api';


export const EntitySpinnakerPipelinesStatusCard = spinnakerPlugin.provide(
  createComponentExtension({
    name: 'EntitySpinnakerPipelinesStatusCard',
    component: {
      lazy: () => import('./components/SpinnakerPipelineStatusCard').then(m => m.SpinnakerPipelinesStatusCard),
    },
  }),
);