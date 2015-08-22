// Polls
// Saves poll to db

module.exports = {
    /**
     * save
     *
     * @param {json} json received from user
     * @param {function} callback(err, data)
     * @return {undefined} undefined
     */
    save: function(poll, callback) {
        // callback(err, data);
        callback(false);
    },
    /**
     * get
     *
     * @param {string} id
     * @param {function} callback(err, data);
     * @return {undefined}
     */
    get: function(id, callback) {
        // ca
        var err = false;
        callback(err);
    }

}
