// basic writer
var knitoutWriter = function(){
	
	this.headers = [];	  // saves headers in addHeader order
	this.operations = []; // saves operations in queued order

	// lowercase entries of expected headers
	// TODO yarn-C
	this.validHeaders = ['machine', 'gauge', 'carriers', 'position'];
	// for error checking perhaps
	this.carriers = [];
};

// helpers for error checking
function checkNumeric( n ) {
	if( Number.isFinite(Number(n)) && !Number.isNaN(Number(n)) ) return true;
	console.error("ERROR: Numeric "+n+" is invalid.");
	return false;
};
function checkCarriers( carriers ) {
	// carriers can be an array of strings without white-spaces 
	if( carriers ==  "" ) return true; // empty carrier names are valid
	let c = (carriers.join(" ")).split(" ");
	if( c.length !== carriers.length ){
		console.error("ERROR: Carrier names have additional white spaces, "+carriers+".");
		return false;
	}
	else{
		// TODO check that these are carriers indeed mentioned earlier
	}
	return true;
};

function checkBedNeedle( at ) {
	
	if( typeof(at) === 'string' ){
		if(at.startsWith('fs') || at.startsWith('bs')){
			if( Number.isInteger( Number(at.substr(2, at.length)) ) ){
				return true;
			}
			console.error("ERROR: Needle number invalid '"+at+"', must be integer");
			return false;
		}
		else if(at.startsWith('f') || at.startsWith('b')){
			if( Number.isInteger( Number(at.substr(1, at.length)) ) ){
				return true;
			}
			console.error("ERROR: Needle number invalid '"+at+"', must be integer");
			return false;
		}
		else{
			console.error("ERROR: Bed invalid '"+at+"', must be 'f','b','fs','bs'");
			return false;
		}
	}
	else {

		
		if(at.length > 2){
			console.error("ERROR: BedNeedle length invalid '"+at+"', must be [ String(bed), Number(needle)]");
			return false;
		
		}
		else {
			let at_arr = Object.keys(at).map(function (key) { return at[key]; });

			if( typeof(at_arr[0]) !== 'string' ){
				console.error("ERROR: BedNeedle invalid '"+at+"', must be [ String(bed), Number(needle)]");
				return false;
			}
			else {
				if(! Number.isInteger(Number(at_arr[1])) ){
			
					console.error("ERROR: BedNeedle invalid '"+at+"', must be [ String(bed), Number(needle)]");
					return false;
				}
				if( at_arr[0] != 'f' &&  at_arr[0] != 'b' &&  at_arr[0] != 'fs' && at_arr[0] != 'bs' ){
				
					console.error("ERROR: Bed invalid '"+ at_arr[0] +"', must be 'f','b','fs','bs'");
					return false;
				}
			}

		}

	}
	return true;

};

function checkDirection( dir ) {
	
	if( dir === '+' || dir === '-' ) return true;
	console.error("ERROR: Direction '"+dir+"' is invalid. Accepts '+' or '-'.");
	return false;
};


// function that queues header information to header list
knitoutWriter.prototype.addHeader = function(name, value){
	
	if( name !== undefined	&& value !== undefined) {
	
		if(name.toString().toLowerCase().startsWith('x-')){
		
			console.warn('Warning: extension  header "' + name.toString() + '", may not be supported on target machine.');
		}
		else if(this.validHeaders.indexOf(name.toString().toLowerCase()) < 0){
			console.warn('Warning: unknown header name "' + name.toString() + '".');
		}
		
		this.headers.push(';;'+name.toString()+': '+value.toString());
	}
	else{ 
		console.warn('Warning: invalid header name or value, did not add header.');
	}

};

// helper to return carriers as a string
let getCarriers = function(carriers){

	if ( carriers === undefined ) return "";
	
	checkCarriers(carriers);
	
	return carriers.join(" ");
	// returns a string of carriers
};

// helper to return bed-needle as a string
let getBedNeedle = function(at){
	
	checkBedNeedle(at);
	
	if(  typeof(at) === 'string' ){
		return at;
	}
	else {
		let at_arr = Object.keys(at).map(function (key) { return at[key]; });
		return at_arr[0] + at_arr[1].toString();
	}
	// returns a string of bed-needle
};


knitoutWriter.prototype.in = function(...carriers){

	checkCarriers(carriers);

	this.operations.push('in ' + getCarriers(carriers)); 

};

knitoutWriter.prototype.inhook = function(...carriers){
	
	checkCarriers(carriers);

	this.operations.push('inhook '	+ getCarriers(carriers));
};


knitoutWriter.prototype.releasehook = function(...carriers){
	
	checkCarriers(carriers);

	this.operations.push('releasehook ' + getCarriers(carriers));

};

knitoutWriter.prototype.out = function(...carriers){
	
	checkCarriers(carriers);

	this.operations.push('out ' + getCarriers(carriers));
};

knitoutWriter.prototype.outhook = function(...carriers){
	
	checkCarriers(carriers);

	this.operations.push('outhook ' + getCarriers(carriers));
};

knitoutWriter.prototype.stitch = function( before, after){


	checkNumeric(before);
	checkNumeric(after);

	this.operations.push('stitch ' + before.toString() + ' ' + after.toString());
};

knitoutWriter.prototype.rack = function(rack){
	
	rack = Number(rack);

	checkNumeric(rack);

	this.operations.push('rack ' + rack.toString());
};

knitoutWriter.prototype.knit = function(dir, at , ...carriers) {
	
	checkDirection(dir);
	checkBedNeedle(at);
	checkCarriers(carriers);
	
	this.operations.push('knit ' + dir + ' '+ getBedNeedle(at) + ' ' + getCarriers(carriers));
};

knitoutWriter.prototype.tuck  = function(dir, at , ...carriers) {

	checkDirection(dir);
	checkBedNeedle(at);
	checkCarriers(carriers);
	
	this.operations.push('tuck ' + dir + ' ' + getBedNeedle(at) + ' ' +getCarriers(carriers));
};

knitoutWriter.prototype.split = function(dir, from, to, ...carriers) {
	
	checkDirection(dir);
	checkBedNeedle(from);
	checkBedNeedle(to);
	checkCarriers(carriers);
	
	this.operations.push('split ' + dir + ' '+ getBedNeedle(from) + ' ' + getBedNeedle(to) + ' ' + getCarriers(carriers));
};

knitoutWriter.prototype.miss = function(dir, at, ...carriers){
	
	checkDirection(dir);
	checkBedNeedle(at);
	checkCarriers(carriers);
	
	this.operations.push('miss ' + dir + ' '+ getBedNeedle(at) + ' ' + getCarriers(carriers));
};


// xfer -> split without yarn, but supported in knitout
knitoutWriter.prototype.xfer = function(from, to) {
	
	checkBedNeedle(from);
	checkBedNeedle(to);
	
	this.operations.push('xfer ' + getBedNeedle(from) + ' ' + getBedNeedle(to));
};

// drop -> knit without yarn, but supported in knitout
knitoutWriter.prototype.drop = function(at) {

	checkBedNeedle(at);
	
	this.operations.push('drop ' + getBedNeedle(at));
};

// amiss -> tuck without yarn, but supported in knitout
knitoutWriter.prototype.amiss = function(at) {

	checkBedNeedle(at);
	this.operations.push('amiss ' + getBedNeedle(at));
};

// add comments to knitout 
knitoutWriter.prototype.comment = function( str ){

	let multi = str.split('\n');
	multi.forEach(function(entry){
		// cannot add header comments with comment
		while(entry.startsWith(';')){
			console.warn('Warning: comment starts with ; use addHeader for adding header comments.');
			entry = entry.substr(1, entry.length);
		}
		this.operations.push(';' + entry.toString());
	}, this);
};

knitoutWriter.prototype.pause = function(comment){
	// deals with multi-line comments
	this.comment(comment);
	this.operations.push('pause');
};

knitoutWriter.prototype.write = function(filename){
	let version = ';!knitout-2';
	let content = version + '\n' +
		this.headers.join('\n') + '\n' + 
		this.operations.join('\n') + '\n';
	try{
		let fs = require('fs');
		fs.writeFileSync(filename, content); //default is utf8 
	} 
	catch(e){
		console.warn("Can't load 'fs'. Did not write file.");
	}
	return content; 
};

// browser-compatibility
if(typeof(module) !== 'undefined'){
	module.exports = knitoutWriter;
}


