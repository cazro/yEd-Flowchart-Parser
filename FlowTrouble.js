
var xml2js = require('xml2js');

function yTags(name){
	var splitName = name.split(':');
	if (splitName.length === 2 && splitName[0] === 'y'){
		var newName = splitName[1];		
		return newName.charAt(0).toLowerCase()+newName.slice(1);
	}else {
		return name;
	}
}

function organize(graphml,callback){
	
	var graph = graphml;
	var flowchart = {start:{}};
	var keys = {};
	var edges = {};
	
	graph.graph.node.forEach(function(node,ind,nodes){ 
		var nodeType = "",type="";
		if(Array.isArray(node.data)){
			node.data.forEach(function(n,i,p){
				for(var d in n){
					if(n[d].nodeLabel){
						nodeType = d;
					} 
				}
			});
		} else {
			for(var d in node.data){
				if(node.data[d].nodeLabel){
						nodeType = d;
				} 
			}
		}
		if(node.data[nodeType].configuration){	
			type = node.data[nodeType].configuration.split('.')[3];
		} else if(node.data[nodeType].shape && node.data[nodeType].shape.type) {
			if(node.data[nodeType].shape.type === 'rectangle'){
				type = "process";
			} else {
				type = "decision";
			}
		}
		if(type.toLowerCase().search('start') !== -1){
			flowchart.start = node;
		}
		var lab;
		if(Array.isArray(node.data[nodeType].nodeLabel)){
			node.data[nodeType].nodeLabel.forEach(function(label,ind,labels){
				if(label['_']){
					lab = label['_'].trim();
				}
			});
		} else {
			if(node.data[nodeType].nodeLabel['_']){
				lab = node.data[nodeType].nodeLabel['_'].trim();
			} else {
				lab = "";	
			}
		}
		
		var next = [], prev = [];
		
		graph.graph.edge.forEach(function(edge,ind,edgez){
			var edgeType = "";
			
			if(edge.target === node.id){
				prev.push({target:edge.target,label:'Back',edge:edge.id});
			}
			if(edge.source === node.id){

				if(type === 'decision'){
					if(Array.isArray(edge.data)){
						for(var d in edge.data){
							
							var datum = edge.data[d];
							for(var e in datum){
								if(typeof e === 'string' && e.search(/edge/gi) !== -1){
									edgeType = e;
								}
							}
							
							if(datum[edgeType] && datum[edgeType].edgeLabel){
								next.push({target:edge.target,label:datum[edgeType].edgeLabel['_'].trim(),edge:edge.id});
								break;
							} else if(datum[edgeType]){
								next.push({target:edge.target,label:'NA',edge:edge.id});
							} else {
								next.push({target:edge.target,label:'NA',edge:edge.id});
							}
						}
					} else {
						for(var d in edge.data){
							if(typeof d === 'string' && d.search(/edge/gi) !== -1){
								edgeType = d;	
							}
						}
						if(edge.data[edgeType] && edge.data[edgeType].edgeLabel){
							next.push({target:edge.target,label:edge.data[edgeType].edgeLabel['_'].trim(),edge:edge.id});
						} else if(edge.data[edgeType]){
							next.push({target:edge.target,label:'NA',edge:edge.id});
						} else {
							next.push({target:edge.target,label:'NA',edge:edge.id});
						}
					}
				} else {
					next.push({target:edge.target,label:'Continue',edge:edge.id});
				}
			}

		});
		flowchart[node.id] = {
			type:type,
			label:lab,
			next:next,
			prev:prev
		};

	});
	graph.key.forEach(function(key,ind,keyz){
		keys[key.id] = key;
	});
	graph.graph.edge.forEach(function(edge,ind,edgez){
		edges[edge.id] = edge;
	});
	callback(flowchart,keys,edges);
	
}

function FlowTrouble(xml,callback){
	var parser = new xml2js.Parser({explicitArray:false,mergeAttrs:true,tagNameProcessors:[yTags]});
	var graphml = null;
	var error = null;
	var flowchart = null;
	var graph = null;
	
	callback = (typeof callback === 'function') ? callback : function() {};
	
	parser.parseString(xml,function(err,result){
		if(err){
			error = err;
			callback(err,{},xml);
		} else {
			graphml = result.graphml;
			organize(graphml,function(fc,keys,edges){
				flowchart = fc;
				graph = {flowchart:fc,
						 keys:keys,
						 edges:edges};
				
				callback(false,flowchart,graphml);
			});
		}
	});
	
	var start = function(callback){
		callback = (typeof callback === 'function') ? callback : function() {};
		
		if(!flowchart){
			callback(false,{message:"The XML is not done parsing."});	
		} else {
			
		}
	};
	
	var next = function(callback){
		callback = (typeof callback === 'function') ? callback : function() {};
		
		if(!flowchart){
			callback(false,{message:"The XML is not done parsing."});	
		} else {
			
		}
	};
	
	var prev = function(callback){
		callback = (typeof callback === 'function') ? callback : function() {};
		
		if(!flowchart){
			callback(false,{message:"The XML is not done parsing."});	
		} else {
			
		}
	};
	
	var end = function(callback){
		callback = (typeof callback === 'function') ? callback : function() {};
		
		if(!flowchart){
			callback(false,{message:"The XML is not done parsing."});	
		} else {
			
		}
	};
	
	var printRaw = function(){
		graphml.key.forEach(function(key,ind,keys){
			console.dir(key);
		});
		graphml.graph.node.forEach(function(node,index,nodes){
			console.log(index);
			if(Array.isArray(node.data)){
				for(var n in node.data){
					for(var d in node.data[n]){
						console.dir(node.data[n][d]);
					}
					
				}
			} else {
				for(var d in node.data){
					console.dir(node.data[d]);
				}
			}
		});
		graphml.graph.edge.forEach(function(edge,index,edges){
			console.log(index);
			if(Array.isArray(edge.data)){
				for(var n in edge.data){
					
					console.dir(edge.data[n]);
				}
			} else {
				console.dir(edge.data);	
			}
		});	
	};
	
	var printFlow = function(){
		for(var f in flowchart){
			console.log(f+': {');
			for(var g in flowchart[f]){
				console.log(g+':')
				console.dir( flowchart[f][g]);	
			}
			console.log('}');
		}
	};
	
	var printOrg = function(){
		for(var g in graph){
			console.log(g+': ');
			console.dir(graph[g]);
		}
	};
	
	return {
		start: start,
		next: next,
		prev: prev,
		end: end,
		printRaw: printRaw,
		printFlow: printFlow,
		printOrg: printOrg
	};
}

module.exports = FlowTrouble;
