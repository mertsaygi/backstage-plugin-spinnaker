import { Entity } from "@backstage/catalog-model";

export const SPINNAKER_ANNOTATION = 'spinnaker.io/application-name';

export const isSpinnakerAvailable = (entity: Entity) => Boolean(entity.metadata.annotations?.[SPINNAKER_ANNOTATION]);

export const useSpinnakerApplicationKey = (entity: Entity) => {
    return entity?.metadata.annotations?.[SPINNAKER_ANNOTATION] ?? '';
  };