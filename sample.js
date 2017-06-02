var knitoutWriter = require('./knitoutWriter')
k = new knitoutWriter();
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');
k.addHeader('Presser','On');
k.addHeader('X-Presser','On');
k.addHeader('x-takedown','On');
k.addHeader('Carriers', '0 1 2 4 5');
k.in('A','B','C');
k.inhook( 'C');
k.releasehook("A");
k.stitch(10,20);
k.stitch('10.0',20);
k.stitch(10.33, '20a' );
k.knit('+', 'f10', [1,2]);
k.knit('+', 'f10', "A A", 'B', 'C');
k.comment("the following is a badly named single string carrier:");
k.knit('+', 'f10', "[1,2]");
k.knit('+', 'f1099');
k.knit('_', 'f1099');
k.rack(0.5);
k.xfer('hf10', 'hf10.5');
k.drop('f10');
k.amiss('f20');
k.comment("transfers are supported in knitout as an opcode");
k.xfer('f20','b20');
k.split('+', 'b10', 'c20', 'A', 'B');
k.knit('-', {bed:'f', needle:10000}, 1);
k.knit('-', ['b', 40000], 20000);
k.miss('+', {bed:'b', needle:-100},4);
k.out(['A','B']);
k.outhook('A','B','C');
k.pause('\tsome comment about the pause');
k.comment('a \tcomment; \n another comment;');
k.comment(';another comment');
k.comment(';;;more comments');
k.write('out.k');


