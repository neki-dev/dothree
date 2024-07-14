import type { WorldEntity, EntityType } from "~/shared/entity/types";

export class Entity implements WorldEntity {
  public type: EntityType;

  public subtype: string;

  constructor(type: EntityType, substype: string = "") {
    this.type = type;
    this.subtype = substype;
  }

  public toString() {
    return this.subtype ? [this.type, this.subtype].join("-") : this.type;
  }
}
