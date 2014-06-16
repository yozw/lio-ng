## # Knight's tour
##
## Source: http://winglpk.sourceforge.net/examples/knightstour/
##
## Determine a closed path a knight can travel
## on a chess board covering all fields.

# size of field
param m;
param n;
# coluns
set X := 1..m;
# rows
set Y := 1..n;
# fields
set F := X cross Y;
# moves
set M := setof{ (x1,y1) in F, (x2,y2) in F : 
  (abs(x1-x2)==2 && abs(y1-y2)==1) || (abs(x1-x2)==1 && abs(y1-y2)==2)}
  (x1,y1,x2,y2);
# transported remaining path length
var v{(x1,y1,x2,y2) in M} >= 0;
# move is chosen
var w{(x1,y1,x2,y2) in M}, binary;
# position of field in tour
var p{(x,y) in F};

# start of the tour
s.t. start :
  p[1,1]=m*n;
# number of incoming moves
s.t. win{(x2,y2) in F} :
  sum{(x1,y1,x2,y2) in M} w[x1,y1,x2,y2] = 1;
# number of outgoing moves
s.t. wout{(x1,y1) in F} :
  sum{(x1,y1,x2,y2) in M} w[x1,y1,x2,y2] = 1;
# transported remaining path length
s.t. vout{(x1,y1) in F} :
  sum{(x1,y1,x2,y2) in M} v[x1,y1,x2,y2] = p[x1,y1];
# remaining path length
s.t. vin{(x2,y2) in F} :
  sum{(x1,y1,x2,y2) in M} v[x1,y1,x2,y2] = 1 + p[x2,y2] 
   - if (x2==1 && y2==1) then m * n else 0;
# remaining path length can only be transported if move is chosen
s.t. vmax{(x1,y1,x2,y2) in M} :
  v[x1,y1,x2,y2] <= m*n*w[x1,y1,x2,y2];

solve;
# output the result
# output
printf "+";
for { x in X } {
  printf "---+";
}
printf "\n";
for {y in Y} {
  printf "|";
  for { x in X } {
    printf "%3d|", m*n+1-p[x,y];
  }
  printf "\n";
  printf "+";
  for { x in X } {
    printf "---+";
  }
  printf "\n";
}
data;
# size of field
# A closed tour is not possible for m <= n if
#   m and n are both odd, or
#   m = 1, 2, or 4, or
#   m = 3 and n = 4, 6, or 8.
param m:= 8;
param n:= 8;
end;
