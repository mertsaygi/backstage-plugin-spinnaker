import { createDevApp } from '@backstage/dev-utils';
import { spinnakerPlugin } from '../src/plugin';

createDevApp().registerPlugin(spinnakerPlugin).render();
