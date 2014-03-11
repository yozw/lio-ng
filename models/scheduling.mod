# Number of jobs
param n;

# Set of of jobs
set J := { 0 .. n };

# Setup and reset times
param c{J, J};

# Index set of all subsets of J
set SI := 1 .. 2^(n+1)-2;

# Set of all subsets of J that are not empty and not equal to J.
set S {k in SI} := setof{j in J : floor(k/2^j) mod 2 = 1} j;

# Decision variables
var delta{J, J} binary;

# Minimize total setup and reset time
minimize z:
	sum{i in J, j in J} delta[i,j] * c[i,j];
 
# Assignment constraints part 1
subject to assignment_i{i in J}:
	sum{j in J} delta[i,j] = 1;

# Assignment constraints part 1
subject to assignment_j{j in J}:
	sum{i in J} delta[i,j] = 1;

# Subtour elimination constraints
subject to subtour{k in SI}:
	sum{i in S[k], j in S[k]} delta[i,j] <= card(S[k]) - 1;

data;

param n := 6;

param c : 0 1 2 3 4 5 6 :=
0 0 1 1 5 4 3 2 
1 1 0 2 5 4 3 2 
2 1 5 0 4 2 5 4 
3 5 4 6 0 6 2 5 
4 5 2 6 3 0 5 4 
5 5 3 5 1 5 0 3 
6 6 5 4 6 6 5 0 ;

end;

