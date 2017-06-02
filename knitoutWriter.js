// basic writer
var knitoutWriter = function(){
	
	this.headers = [];	  // saves headers in addHeader order
	this.operations = []; // saves operations in queued order

	// for error checking perhaps
	this.carriers = [];
};

// function that queues header information to header list
knitoutWriter.prototype.addHeader = function(name, value){
	
	// Machine
	// Gauge
	// Carriers
	// Yarn-C
	// Position
	// X-
	
	if( name !== undefined	&& value !== undefined) {
		this.headers.push(';;'+name.toString()+': '+value.toString());
	}

};

// helper to return carriers as a string
let getCarriers = function(carriers){

	if ( carriers === undefined ) return "";

	let carrierStr = "";
	if( !Array.isArray(carriers)){
		carrierStr = carrierStr + carriers.toString();
	}
	else{
		carrierStr = carrierStr + carriers.join(" ");
	}

	return carrierStr;
	// returns a string of carriers
};

// helper to return bed-needle as a string
let getBedNeedle = function(at){

	if(  typeof(at) === 'string' ){
		return at;
	}
	else {
		return at.bed+at.needle;
	}
	// returns a string of bed-needle
};


knitoutWriter.prototype.in = function(...carriers){

	this.operations.push('in ' + getCarriers(carriers)); 

};

knitoutWriter.prototype.inhook = function(...carriers){

	this.operations.push('inhook '	+ getCarriers(carriers));
};


knitoutWriter.prototype.releasehook = function(...carriers){
	
	this.operations.push('releasehook ' + getCarriers(carriers));

};

knitoutWriter.prototype.out = function(...carriers){
	this.operations.push('out ' + getCarriers(carriers));
};

knitoutWriter.prototype.outhook = function(...carriers){
	this.operations.push('outhook ' + getCarriers(carriers));
};

knitoutWriter.prototype.stitch = function( before, after){
	this.operations.push('stitch ' + before + ' ' + after);
};

knitoutWriter.prototype.rack = function(rack){
	this.operations.push('rack ' + rack);
};

knitoutWriter.prototype.knit = function(dir, at , ...carriers) {
	// if len(carriers) > 1, add comment ;knit together
	// dir = '+', '-'
	console.assert( (dir == '+' || dir == '-'), "valid directions are '+' or '-'.");
	this.operations.push('knit ' + dir + ' '+ getBedNeedle(at) + ' ' + getCarriers(carriers));
};

knitoutWriter.prototype.tuck  = function(dir, at , ...carriers) {

	this.operations.push('tuck ' + dir + ' ' + getBedNeedle(at) + ' ' +getCarriers(carriers));
};

knitoutWriter.prototype.split = function(dir, from, to, ...carriers) {
	this.operations.push('split ' + dir + ' '+ getBedNeedle(from) + ' ' + getBedNeedle(to) + ' ' + getCarriers(carriers));
};

knitoutWriter.prototype.miss = function(dir, at, ...carriers){
	this.operations.push('miss ' + dir + ' '+ getBedNeedle(at) + ' ' + getCarriers(carriers));
};

knitoutWriter.prototype.pause = function(comment){
	this.operations.push('pause'+' ;'+comment.toString());
};

// xfer -> split without yarn, but supported in knitout
knitoutWriter.prototype.xfer = function(from, to) {
	this.operations.push('xfer ' + getBedNeedle(from) + ' ' + getBedNeedle(to));
};

// drop -> knit without yarn, but supported in knitout
knitoutWriter.prototype.drop = function(at) {
	this.operations.push('drop ' + getBedNeedle(at));
};

// amiss -> tuck without yarn, but supported in knitout
knitoutWriter.prototype.amiss = function(at) {
	this.operations.push('amiss ' + getBedNeedle(at));
};

// add comments to knitout 
knitoutWriter.prototype.comment = function( str ){

	let multi = str.split('\n');
	multi.forEach(function(entry){
		while(entry.startsWith(';')){
			entry = entry.substr(1, entry.length);
		}
		this.operations.push(';' + entry.toString());
	}, this);
};

knitoutWriter.prototype.write = function(filename){
	let fs = require('fs');
	let version = ';!knitout-2';
	let content = version + '\n' +
				  this.headers.join('\n') + '\n' + 
				  this.operations.join('\n') + '\n';
	fs.writeFileSync(filename, content); //default is utf8 
	return content; 
};

module.exports = knitoutWriter;


