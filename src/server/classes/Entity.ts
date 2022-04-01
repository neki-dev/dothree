import { EntityType, WorldEntity } from '~type/Entity';

export default class Entity implements WorldEntity {
  public type: EntityType;

  public subtype?: string;

  constructor(type: EntityType, substype: string = undefined) {
    this.type = type;
    this.subtype = substype;
  }

  toString() {
    return this.subtype ? [this.type, this.subtype].join('-') : this.type;
  }
}
