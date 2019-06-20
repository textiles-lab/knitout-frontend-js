// import the knitoutWriter code and instantiate it as an object
var knitout = require('./knitout');
k = new knitout.Writer({carriers:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');

// swatch variables
var height = 10;
var width = 10;
var carrier = "6";
k.fabricPresser("auto");
// bring in carrier using yarn inserting hook
k.inhook(carrier); 
// tuck on alternate needles to cast on
for (var s=width; s>0; s--) {
	if (s%2 == 0) {
		k.tuck("-", "f"+s, carrier);
	}
	else {
		k.miss("-", "f"+s, carrier);
	}
}
for (var s=1; s<=width; s++) {
	if (s%2 != 0) {
		k.tuck("+", "f"+s, carrier);
	}
	else {
		k.miss("+", "f"+s, carrier);
	}
}

// release the yarn inserting hook
k.releasehook(carrier);

// knit some rows back and forth
for (var h=0; h<height; h++) {
	for (var s=width; s>0; s--) {
		k.knit("-", "f"+s, carrier);
	}
	for (var s=1; s<=width; s++) {
		k.knit("+", "f"+s, carrier);
	}
}

// bring the yarn out with the yarn inserting hook
k.outhook(carrier);

// write the knitout to a file called "out.k"
k.write('out.k');
console.log('wrote out.k')

