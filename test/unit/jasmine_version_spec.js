'use strict';

describe('Test to print out jasmine version', function() {
	it('prints jasmine version', function() {
	    if (jasmine.version) { //the case for version 2.0.0
	       console.log('jasmine-version:' + jasmine.version);
	    }
	    else { //the case for version 1.3
	       console.log('jasmine-version:' + jasmine.getEnv().versionString());
	    }
	});    
});