import { WorldEntity } from '~root/src/types/World';

export default class Entity implements WorldEntity {
  public type: string;

  public subtype: string;

  constructor(type: string, substype: string = undefined) {
    this.type = type;
    this.subtype = substype;
  }

  toString() {
    return this.subtype ? [this.type, this.subtype].join('-') : this.type;
  }
}
