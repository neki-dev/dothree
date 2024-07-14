import { EntityType } from "~type/entity";

export const typeBlock = { type: EntityType.BLOCK, subtype: "" };
export const typeEmpty = { type: EntityType.EMPTY, subtype: "" };

export default {
  data: typeEmpty,
  x: 0,
  y: 0,
  isCurrentStep: false,
  onPut: jest.fn(),
};
