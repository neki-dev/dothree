import type { WorldEntity, EntityType } from "~/shared/entity/types";

export class Entity implements WorldEntity {
  public readonly type: EntityType;

  public readonly subtype: string;

  constructor(type: EntityType, substype: string = "") {
    this.type = type;
    this.subtype = substype;
  }

  public toString() {
    return this.subtype
      ? `${this.type}-${this.subtype}`
      : this.type;
  }
}
