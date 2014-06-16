## # A knapsack problem

# Set of items
set I;

# Parameters
param a{I};
param b;
param c{I};

# Decision variables
var x{I} >= 0, <= 1;

# Objective
maximize z:
	sum {i in I} c[i] * x[i];
    
# Knapsack constraint
subject to knapsack:
	sum {i in I} a[i] * x[i] <= b;

data;

set I := 1 2 3 4 5;

param a := 
  1 5
  2 4
  3 7
  4 6
  5 2;
  
param b := 15;

param c := 
  1 5
  2 3
  3 6
  4 6
  5 2;
  
end;

