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
        this.mongo.connect(this.uri, function(err, db) {
            if (err) {
                callback('failed to connect to db');
            }
            var collection = db.collection('polls');

            collection.find({url:id}).toArray(function(err,result){
                callback(err,result);
            });
        });
    },
    /**
     * submitVote
     *
     * @param {Object} poll
     * @param {function} callback
     * @return {undefined}
     */
    submitVote: function(poll, callback) {
        var option = "choice" + poll.choice;
        this.mongo.connect(this.uri, function(err, db) {
            if (err) {
                return callback('failed');
            }
            var collection = db.collection('polls');
            collection.update(
                {"url": poll.id, "choices.id": option},
                {$inc: {"choices.$.vote": 1}}, 
                callback
            );
        });
    }
}
