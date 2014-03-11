param S;
param n;
param lambda >= 0;

param R{1..S, 1..n};

param mu{i in 1..n} := sum{s in 1..S} R[s,i] / S;

var return;
var risk;
var x{1..n} >= 0;
var uplus {1..S} >= 0;
var uminus{1..S} >= 0;

maximize z:
	lambda * (sum{s in 1..S, i in 1..n} R[s,i] * x[i]) / S
    - sum{s in 1..S} (uplus[s] + uminus[s]) / S;
    
subject to budget:
	sum {i in 1..n} x[i] = 1;
    
subject to usdef {s in 1..S}:
    uplus[s] - uminus[s] = sum{i in 1..n} (R[s,i] - mu[i]) * x[i];
    
subject to return_def:
    return = sum{s in 1..S, i in 1..n} R[s,i] * x[i] / S;

subject to risk_def:
    risk = sum{s in 1..S} (uplus[s] + uminus[s]) / S;

data;

param S := 6;
param n := 5;

param R : 1 2 3 4 5:=
  1  -0.0423  -0.0158   0.002    0.055    0.0214  
  2   0.083    0.0078  -0.0034   0.051    0.0248  
  3   0.0643   0.0162   0.0119  -0.029    0.0462  
  4   0.0035   0.0398   0.0214  -0.0019  -0.0272  
  5   0.0185   0.0061   0.016   -0.033   -0.0058  
  6  -0.061    0.0179   0.0061   0.0239  -0.0024 ;
    
param lambda := 4;
    
end;


