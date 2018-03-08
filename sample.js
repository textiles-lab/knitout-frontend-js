var knitout = require('./knitout')
k = new knitout.Writer({carriers:["B","A","2","C"]});
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');
k.addHeader('Presser','On');
k.addHeader('X-Presser','On');
k.addHeader('X-Takedown','On');
k.in('A','B','C');
k.inhook( 'C');
k.releasehook("A");
k.stitch(10,20);
k.stitch(10.0,20);
k.stitch(10.33, 20 );
k.knit('+', 'f10', ['A','2']);
k.knit('+', 'f10', "A", 'B', 'C');
k.comment("the following is a badly named single string carrier:");
try {
	k.knit('+', 'f10', "[1,2]"); //invalid carrier name
	console.assert(false);
} catch (e) { }
k.knit('+', 'f1099');
try {
	k.knit('_', 'f1099'); //_ is not a direction
	console.assert(false);
} catch (e) { }
k.rack(0.5);
try {
	k.xfer('fs10', 'fs10.5'); //10.5 is not a valid needle
	console.assert(false);
} catch (e) { }
k.drop('f10');
k.amiss('f20');
k.comment("transfers are supported in knitout as an opcode");
k.xfer('f20','b20');
k.split('+', 'b10', 'f20', 'A', 'B');
try {
	k.split('+', 'b10', 'c20', 'A', 'B'); //c20 isn't a valid bed
	console.assert(false);
} catch (e) { }
try {
	k.knit('-', {bed:'f', needle:10000}, '1'); //'1' not a carrier
	console.assert(false);
} catch (e) { }
try {
	k.knit('-', ['b', 40000], 20000); //not a valid carrier name
	console.assert(false);
} catch (e) { }
try {
	k.knit('-', ['b', 40000], 20000); //not a valid carrier name
	console.assert(false);
} catch (e) { }
try {
	k.miss('+', {bed:'b', needle:-100},4); //4 is not a string, so not a valid carrier name
	console.assert(false);
} catch (e) { }
k.out(['A','B']);
k.outhook('A','B','C');
k.pause('\tsome comment about the pause');
k.comment('a \tcomment; \n another comment;');
k.comment(';another comment');
k.comment(';;;more comments');
k.write('out.k');


