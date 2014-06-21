## # A knapsack problem
## The name *knapsack problem* derives from the following problem setting. We are given a number of objects that have
## to be packed into a knapsack. Each object has a given value and a given size. The knapsack also has a given size,
## so in general we cannot pack all objects into it. We want to pack the objects in such a way that we carry with us
## the most valuable combination of objects, subject to the constraint that the total size of the objects does not
## exceed the size of the knapsack. So we need to decide which objects are to be packed in the knapsack and which ones
## are not. Knapsack problems can usually effectively be solved by means of the *branch-and-bound algorithm*.

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

