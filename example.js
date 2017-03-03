var fs = require('fs');
var FlowTrouble = require('./FlowTrouble');

var troubleSlits = new FlowTrouble(fs.readFileSync('slits.graphml','utf8'),function(err,flowchart,graphml){
	if(err){
		console.log(err);
		exit();
	}
});

troubleSlits.printFlow();