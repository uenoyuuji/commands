var expect = require('chai').expect;
var assert = require('chai').assert;

describe('commands', function() {
    var define = require('../commands').define;

    it('should has a function named define', function() {
        expect(define).to.be.a('function');
    });

    describe('define', function() {
        it('should returns an object that has a function named apply', function() {
            var definedCommands = define();
            expect(definedCommands).not.to.be.null;
            expect(definedCommands).to.be.a('object');
            expect(definedCommands.apply).to.be.a('function');
        });

        describe('apply', function() {
            it('defined command', function() {
                process.argv = ['node', 'file', 'command1', 'arg1', 'arg2'];

                var fail = this.fail;
                var commandCalled = 0;
                var definedCommands = define({
                    command1: function(arg1, arg2) {
                        expect(arg1).to.equal(process.argv[3]);
                        expect(arg2).to.equal(process.argv[4]);
                        commandCalled++;
                    },
                    command2: function() {
                        assert.fail(null, null, 'unexpected command function called');
                    }
                });
                expect(commandCalled).to.equal(0);

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).to.be.true;
                    expect(command).to.equal(process.argv[2]);
                    expect(Array.isArray(args)).to.be.true;
                    expect(args[0]).to.equal(process.argv[3]);
                    expect(args[1]).to.equal(process.argv[4]);
                    applyCalled++;
                });
                expect(commandCalled).to.equal(1);
                expect(applyCalled).to.equal(1);
            });

            it('missing command', function() {
                process.argv = ['node', 'file'];

                var definedCommands = define({
                    command1: function() {
                        assert.fail(null, null, 'unexpected command function called');
                    },
                    command2: function() {
                        assert.fail(null, null, 'Assertion failure: unexpected command function called');
                    }
                });

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).to.be.false;
                    expect(command).not.to.be.a('string');
                    expect(Array.isArray(args)).to.be.true;
                    expect(args).to.have.length(0);
                    applyCalled++;
                });
                expect(applyCalled).to.equal(1);
            });

            it('undefined command', function() {
                process.argv = ['node', 'file', 'command3'];

                var definedCommands = define({
                    command1: function() {
                        assert.fail(null, null, 'unexpected command function called');
                    },
                    command2: function() {
                        assert.fail(null, null, 'unexpected command function called');
                    }
                });

                var applyCalled = 0;
                definedCommands.apply(function(applied, command, args) {
                    expect(applied).to.equal(false);
                    expect(command).to.equal(process.argv[2]);
                    expect(Array.isArray(args)).to.be.true;
                    expect(args).to.have.length(0);
                    applyCalled++;
                });
                expect(applyCalled).to.equal(1);
            });
        });
    });
});
