var x1 >= 0;
var x2 >= 0;
var x3 >= 0;

minimize z:
    40 * x1 + 100 * x2 + 150 * x3;
    
subject to vitaminA:
    x1 + 2 * x2 + 2 * x3 = 3;
    
subject to vitaminC:
    30 * x1 + 10 * x2 + 20 * x3 = 75;
    
end;

