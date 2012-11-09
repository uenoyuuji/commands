/**
 * key 
 * @param {Object} commands
 */
exports.define = function(commands) {
    if(commands === null || typeof commands !== 'object') {
        commands = {};
    }
    return {
        /**
         * @param {Function(applied:Boolean, command:String, argv:String[])} callback
         */
        apply: function(callback) {
            var argv = process.argv.slice(2);
            var applyCallback = function(applied, command, args) {
                callback.apply(null, [applied, command, args]);
            };
            if(argv.length === 0) {
                applyCallback(false, null, []);
                return;
            }
            var command = commands[argv[0]];
            if(typeof command !== 'function') {
                applyCallback(false, argv[0], argv.slice(1));
                return;
            }
            command.apply(null, argv.slice(1));
            applyCallback(true, argv[0], argv.slice(1));
        }
    };
};
