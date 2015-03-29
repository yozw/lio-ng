param N;
set I := 1 .. N;

var x1;
var x2;

maximize z:     3*x1 + 2*x2;

subject to c{i in I}:
sin(2 * 3.1415 * i / N) * x1 + cos(2 * 3.1415 * i / N) * x2 <= 5;

data;

param N := 16;

end;


