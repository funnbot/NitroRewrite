/**
 * Simple in memory storage.
 * 
 * @class
 */
class SimpleStorage {
    constructor(client, id, type) {
        this.client = client;
        this.id = id
        this.type = type
    }

    /**
     * Set this id to key equal to value
     * 
     * @param {String} key 
     * @param {any} [value=true]
     * @returns {any}
     * @memberof SimpleStorage
     */
    set(key, value = true) {
        if (!this.sc[key]) this.sc[key] = {}
        this.sc[key][this.id] = value;  
        return this.sc[key][this.id];
    }

    /**
     * Get value of this id set to key
     * 
     * @param {String} key 
     * @returns {any}
     * @memberof SimpleStorage
     */
    get(key) {
        return this.sc[key] ? this.sc[key][this.id] : undefined;
    }

    /**
     * If this id exists on key
     * @param {any} key 
     * @returns 
     * @memberof SimpleStorage
     */
    exists(key) {
        return this.sc[key] ? !!this.sc[key][this.id] : !1;
    }

    /**
     * Delete value of this id set to key
     * 
     * @param {String} key 
     * @returns {Boolean}
     * @memberof SimpleStorage
     */
    delete(key) {
        let bool = this.sc[key] && this.sc[key][this.id];
        this.sc[key] && delete this.sc[key][this.id];
        return bool;
    }

    /**
     * Delete all ids set to this key
     * 
     * @param {any} key 
     * @returns 
     * @memberof SimpleStorage
     */
    deleteAll(key) {
        let bool = !!this.sc[key];
        delete this.sc[key];
        return bool;
    }

    /**
     * Shortcut 
     * @private
     */
    get sc() {
        return this.client.SimpleStorage[this.type];
    }
}

module.exports = SimpleStorage;