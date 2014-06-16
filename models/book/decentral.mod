## # A decentralization problem

set DC;
set CITY;

param B{DC, CITY};
param K{CITY, CITY};

var delta{DC, CITY} binary;
var nu{DC, CITY, DC, CITY} binary;

maximize z:
  sum {i in DC, j in CITY} delta[i,j] * B[i,j]
  - 0.5 * sum {i in DC, k in DC, j in CITY, l in CITY} nu[i,j,k,l] * K[j,l];     

subject to assignToOneCity{i in DC}:
	sum {j in CITY} delta[i, j] = 1;
    
subject to assignToOneDC{j in CITY}:
	sum {i in DC}   delta[i, j] <= 1;
    
subject to logical1{i in DC, k in DC, j in CITY, l in CITY}:
	delta[i,j] + delta[k,l] - 2 * nu[i, j, k, l] >= 0;

subject to logical2{i in DC, k in DC, j in CITY, l in CITY}:
	delta[i,j] + delta[k,l] - nu[i, j, k, l] <= 1;

data;

set DC   := LARGE SMALL;
set CITY := A B C;
param B : A B C :=
LARGE 1000 1200 1500
SMALL  400  700  800;

param K : A B C :=
A 0 1100 1500
B 1100 0 1600
C 1500 1600 0;

end;

