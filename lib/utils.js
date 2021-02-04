module.exports = {

    probability: (v) => (Math.floor(1 + Math.random() * 100) <= v),

    randomize: (v) => v[[Math.floor(Math.random() * v.length)]],

    mainstay: (map, x, y) => {
        if (y + 1 === map.length) {
            return true;
        } else {
            const [type] = map[y + 1][x].split('-');
            return ['player', 'block'].includes(type);
        }
    },

    validate: (data, schemes) => {
        return Object.entries(schemes).reduce((a, [param, scheme]) => {
            const value = Number(data[param]);
            const valid = (!Number.isNaN(value) && value >= scheme.min && value <= scheme.max);
            return {
                ...a,
                [param]: valid ? value : scheme.default,
            };
        }, {});
    },

    generate: () => Math.random().toString(36).substr(2, 9),

};