import utils from '../utils';

import type WorldLocation from '~type/WorldLocation';
import type WorldMap from '~type/WorldMap';
import LobbyOptions from '~type/LobbyOptions';

const MAP_SIZE = [25, 11];
const MAP_ENTITY = {
    EMPTY: 'empty',
    BLOCK: 'block',
    PLAYER: 'player',
    BONUS: 'bonus',
};
const ENTITY_BONUS = {
    REPLACER: 'replacer',
    SPAWN: 'spawn',
    LASER: 'laser',
};

export default class World {

    readonly map: WorldMap = [];
    private readonly options: LobbyOptions;

    constructor(options: LobbyOptions) {
        this.options = options;
    }

    generateMap(): void {
        for (let y = 0; y < MAP_SIZE[1]; y++) {
            this.map[y] = [];
            for (let x = 0; x < MAP_SIZE[0]; x++) {
                const location: WorldLocation = [x, y];
                const entity: string = this.createRandomEntity(location);
                this.setEntity(location, entity);
            }
        }
    }

    place(slot: number, location: WorldLocation): WorldLocation[] {
        if (!this.canBePlaced(location)) {
            return;
        }
        let locations: WorldLocation[] = [location];
        const types: string[] = this.getEntity(location).split('-');
        if (types[0] === MAP_ENTITY.BONUS) {
            const additional = this.useBonus(slot, location, types[1]);
            locations = locations.concat(additional);
        } else if (types[0] !== MAP_ENTITY.EMPTY) {
            return;
        }
        for (const location of locations) {
            this.setEntity(location, `${MAP_ENTITY.PLAYER}-slot${slot}`);
        }
        return locations;
    }

    checkWinning(locations: WorldLocation[]): boolean {
        for (const location of locations) {
            const results = this.getWinningLocations(location);
            if (results) {
                for (const result of results) {
                    const entity = this.getEntity(result);
                    this.setEntity(result, `${entity}-win`);
                }
                return true;
            }
        }
        return false;
    }

    useBonus(slot: number, location: WorldLocation, type: string): WorldLocation[] {
        const additional: WorldLocation[] = [];
        switch (type) {
            case ENTITY_BONUS.REPLACER: {
                const puttedEntities: WorldLocation[] = [];
                this.eachMap((entity: string, x: number, y: number) => {
                    const [type, targetSlot]: string[] = entity.split('-');
                    if (type === MAP_ENTITY.PLAYER && Number(targetSlot.replace('slot', '')) !== slot) {
                        puttedEntities.push([x, y]);
                    }
                });
                if (puttedEntities.length > 0) {
                    additional.push(utils.randomize(puttedEntities));
                }
                break;
            }
            case ENTITY_BONUS.SPAWN: {
                const emptyEntities: WorldLocation[] = [];
                this.eachMap((entity: string, x: number, y: number) => {
                    if (entity === MAP_ENTITY.EMPTY && this.canBePlaced([x, y])) {
                        emptyEntities.push([x, y]);
                    }
                });
                if (emptyEntities.length > 0) {
                    additional.push(utils.randomize(emptyEntities));
                }
                break;
            }
            case ENTITY_BONUS.LASER: {
                for (const y of Object.keys(this.map)) {
                    this.setEntity([location[0], Number(y)], MAP_ENTITY.EMPTY)
                }
                additional[0][1] = this.map.length - 1;
                break;
            }
        }
        return additional;
    }

    moveMap(): void {
        for (const [y, line] of Object.entries(this.map)) {
            line.shift();
            const location: WorldLocation = [line.length, Number(y)];
            const entity: string = this.createRandomEntity(location);
            this.setEntity(location, entity);
        }
    }

    private canBePlaced(location: WorldLocation): boolean {
        if (location[1] + 1 === this.map.length) {
            return true;
        } else {
            const entity = this.getEntity([location[0], location[1] + 1]);
            if (entity) {
                const [type] = entity.split('-');
                return [MAP_ENTITY.PLAYER, MAP_ENTITY.BLOCK].includes(type);
            } else {
                return false;
            }
        }
    }

    private setEntity(location: WorldLocation, type: string): void {
        if (this.locationIsValid(location)) {
            this.map[location[1]][location[0]] = type;
        }
    }

    private getEntity(location: WorldLocation): string | undefined {
        if (this.locationIsValid(location)) {
            return this.map[location[1]][location[0]];
        }
    }

    private locationIsValid(location: WorldLocation): boolean {
        return location.every((p, i) => (p >= 0 && p < MAP_SIZE[i]));
    }

    private eachMap(callback: Function): void {
        for (const [y, line] of Object.entries(this.map)) {
            for (const [x, entity] of Object.entries(line)) {
                callback(entity, Number(x), Number(y));
            }
        }
    }

    private getWinningLocations(from: WorldLocation): WorldLocation[] {
        for (const line of [[-1, 0], [-1, -1], [0, -1], [1, -1]]) {
            for (let side = 0; side > -this.options.targetLength; side--) {
                const locations: WorldLocation[] = [];
                for (let step = side; step <= (side + this.options.targetLength - 1); step++) {
                    const point = <WorldLocation>from.map((f, i) => (f - line[i] * step));
                    if (point.every((c, i) => (c >= 0 && c < MAP_SIZE[i]))) {
                        locations.push(point);
                    }
                }
                if (locations.length === this.options.targetLength) {
                    if (locations.every((location) => (this.getEntity(location) === this.getEntity(from)))) {
                        return locations;
                    }
                }
            }
        }
    }

    private createRandomEntity(location: WorldLocation): string {
        if (utils.probability(this.options.density)) {
            return MAP_ENTITY.BLOCK;
        } else if (this.options.useBonuses && location[1] + 1 !== MAP_SIZE[1] && utils.probability(this.options.bonusing)) {
            return MAP_ENTITY.BONUS + '-' + utils.randomize([
                ENTITY_BONUS.REPLACER,
                ENTITY_BONUS.SPAWN,
                ENTITY_BONUS.LASER,
            ]);
        } else {
            return MAP_ENTITY.EMPTY;
        }
    }

}