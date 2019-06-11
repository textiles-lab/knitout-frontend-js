var knitout = require('./knitout')
k = new knitout.Writer({carriers:["1", "2", "3", "4", "10"]});
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');
k.addHeader('Presser','On');
k.addHeader('X-Presser','On');
k.addHeader('X-Takedown','On');

k.knit('-', 'b3', "10");
k.knit('-', 'b3', "   10");
k.knit('+', 'f1', "2", "3");
k.knit('+', 'f1', ["1  ", "2"]);
k.knit('-', 'b3', "1    3");
k.tuck('-', 'b3', "1,   4");
k.write("carriers.k");
