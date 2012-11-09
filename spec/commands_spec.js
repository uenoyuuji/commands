describe('commands', function() {
    var define = require('../commands').define;

    it('should has a function named define', function() {
        expect(typeof(define)).toBe('function');
    });

    describe('define', function() {
        it('should returns an object that has a function named apply', function() {
            var definedCommands = define();
            expect(definedCommands).not.toBeNull();
            expect(typeof(definedCommands)).toBe('object');
            expect(typeof(definedCommands.apply)).toBe('function');
        });

        describe('apply', function() {
            it('defined command', function() {
                process.argv = ['node', 'file', 'command1', 'arg1', 'arg2'];

                var fail = this.fail;
                var commandCalled = 0;
                var definedCommands = define({
                    command1: function(arg1, arg2) {
                        expect(arg1).toBe(process.argv[3]);
                        expect(arg2).toBe(process.argv[4]);
                        commandCalled++;
                    },
                    command2: function() {
                        fail(Error('Assertion failure: unexpected command function called'));
                    }
                });
                expect(commandCalled).toBe(0);

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).toBe(true);
                    expect(command).toBe(process.argv[2]);
                    expect(Array.isArray(args)).toBe(true);
                    expect(args[0]).toBe(process.argv[3]);
                    expect(args[1]).toBe(process.argv[4]);
                    applyCalled++;
                });
                expect(commandCalled).toBe(1);
                expect(applyCalled).toBe(1);
            });

            it('missing command', function() {
                process.argv = ['node', 'file'];

                var fail = this.fail;
                var definedCommands = define({
                    command1: function() {
                        fail(Error('Assertion failure: unexpected command function called'));
                    },
                    command2: function() {
                        fail(Error('Assertion failure: unexpected command function called'));
                    }
                });

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).toBe(false);
                    expect(command).toBeFalsy();
                    expect(Array.isArray(args)).toBe(true);
                    expect(args.length).toBe(0);
                    applyCalled++;
                });
                expect(applyCalled).toBe(1);
            });

            it('undefined command', function() {
                process.argv = ['node', 'file', 'command3'];

                var fail = this.fail;
                var definedCommands = define({
                    command1: function() {
                        fail(Error('Assertion failure: unexpected command function called'));
                    },
                    command2: function() {
                        fail(Error('Assertion failure: unexpected command function called'));
                    }
                });

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).toBe(false);
                    expect(command).toBe(process.argv[2]);
                    expect(Array.isArray(args)).toBe(true);
                    expect(args.length).toBe(0);
                    applyCalled++;
                });
                expect(applyCalled).toBe(1);
            });
        });
    });
});
