var knitoutWriter = require('./knitoutWriter')
k = new knitoutWriter();
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');
k.addHeader('Carriers', '0 1 2 4 5');
k.in('A','B','C');
k.inhook('+', 'f1', 'C');
k.releasehook('A');
k.stitch(10,20);
k.knit('+', 'f10', [1,2]);
k.knit('+', 'f10', 'A', 'B', 'C');
k.knit('+', 'f10', "[1,2]");
k.knit('+', 'f10', "1");
k.rack(0.5);
k.split('+', 'b10', 'c20', 'A', 'B');
k.knit('-', {bed:'f', needle:10}, 1);
k.miss('+', {bed:'b', needle:-100},4);
k.out(['A','B']);
k.outhook('A','B','C');
k.pause('some comment');
k.write('out.k');

