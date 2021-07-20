interface ValidateSchemes {
    [key: string]: {
        default: number,
        min: number,
        max: number,
    },
}

export default {

    probability: (v: number): boolean => {
        return (Math.floor(1 + Math.random() * 100) <= v);
    },

    randomize: (v: Array<any>): any => {
        return v[Math.floor(Math.random() * v.length)];
    },

    validate: (data: any, schemes: ValidateSchemes) => {
        return Object.entries(schemes).reduce((a, [param, scheme]) => {
            const value = Number(data[param]);
            const valid = (!Number.isNaN(value) && value >= scheme.min && value <= scheme.max);
            return {
                ...a,
                [param]: valid ? value : scheme.default,
            };
        }, {});
    },

    generate: (): string => {
        return Math.random().toString(36).substr(2, 9);
    },

};