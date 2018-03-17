class Iterator {
    for (iterator, callback) {
        let i = 0;
        while (i < iterator.length) {
            const elem = iterator[i];
            callback(elem, i);
            i++;
        }
    }

    async forAsync(iterator, callback) {
        let i = 0;
        while (i < iterator.length) {
            const elem = iterator[i];
            await callback(elem, i);
            i++;
        }
    }

    forIn(iterator, callback) {
        let i = 0;
        for (let elem in iterator) {
            if (iterator.hasOwnProperty(elem)) {
                callback(elem, i);
                i++;
            }
        }
    }

    async forInAsync(iterator, callback) {
        let i = 0;
        for (let elem in iterator) {
            if (iterator.hasOwnProperty(elem)) {
                await callback(elem, i);
                i++;
            }
        }
    }
}