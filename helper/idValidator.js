/**
 * Created by pavan on 8/30/15.
 */


//id validation module


'use strict';

var idValidator = function(id,callback){
    var err = false;
    var required = ['question', 'choices'];

    if (poll === undefined) {
        err = 'undefined id';
        return false;
    }
    if ((poll).length === 0) {
        err = 'id value cannot be empty';
        return false;
    }

    callback(err);

    if (err) {
        return false;
    }
    return true;
}
module.exports=idValidator;
