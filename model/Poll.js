// Polls
// Saves poll to db

module.exports = {
    /**
     * init
     *
     * @param {string} uri for mongodb
     * @param {MongoClient} mongo
     * @return {self} returns self
     */
    init: function(uri, mongo) {
        this.uri = uri;
        this.mongo = mongo;
        // Chainable
        return this;
    },
    /**
     * connect
     *
     * Not implemented yet
     *
     * @return {undefined}
     */
    connect: function() {
    },
    /**
     * save
     *
     * @param {json} json received from user
     * @param {function} callback(err, data)
     * @return {undefined} undefined
     */
    save: function(poll, callback) {
        this.mongo.connect(this.uri, function(err, db) {
            if (err) {
                callback('failed to connect to db');
            }
            var collection = db.collection('polls');
            collection.insert(poll, {w: 1}, function(err, result) {
                callback(err);
            });
        });
    },
    /**
     * get
     *
     * @param {string} id
     * @param {function} callback(err, data);
     * @return {undefined}
     */
    get: function(id, callback) {
        // callback(err)
        var err = false;
        callback(err);
    }

}
