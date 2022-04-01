import { EntityType } from '~type/Entity';

export const typeBlock = { type: EntityType.BLOCK };
export const typeEmpty = { type: EntityType.EMPTY };

export default {
  data: typeEmpty,
  x: 0,
  y: 0,
  onPut: jest.fn(),
};
