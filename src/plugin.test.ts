import { spinnakerPlugin } from './plugin';

describe('spinnaker', () => {
  it('should export plugin', () => {
    expect(spinnakerPlugin).toBeDefined();
  });
});
