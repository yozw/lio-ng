## # Personnel assignment problem
## This example deals with scheduling the workforce for a production plant.
## In a production plant every day a certain number of personnel is needed. Given personnel can be be
## hired for a minimum up to a maximum number of days in a row, requiring a minimum number of leave days
## before they can be employed again. The task is to find the work schedule minimizing total wages to be paid.
##
## Determine cheapest shift schedule, given:
##
## * A workload per day
## * Available workers with:
##
##   * Minimum working days in a row
##   * Maximum working days in a row
##   * Minimum leave days in a row
##   * Daily wage
##
##
## Source: http://winglpk.sourceforge.net/examples/workforce/
##
## Author: Xypron, 2009 (inspired by CADI Abdelahd)
##
## This example is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY. Feel free to copy or modify.

# workload (day, workload)
set L, dimen 2;

# workers (name, min workdays, max workdays, minimum leave, wage)
set W, dimen 5;

# names of workers
set V := setof{(v, b, c, d, e) in W} v;

# periods
set B := ( (min{(b,c) in L} b) .. (max{(b,c) in L} b) );

# minimum number of workdays in row
param ri{v in V} := min{(v, b, c, d, e) in W} b;

# maximum number of workdays in row
param ra{v in V} := min{(v, b, c, d, e) in W} c;

# minimum leave days in row
param ml{v in V} := min{(v, b, c, d, e) in W} d;

# wage
param wa{v in V} := min{(v, b, c, d, e) in W} e;

# work offer [worker, start, duration]
# (for large problems consider column generation to create work offers)
set O := setof{ v in V, s in B, d in {ri[v]..ra[v]}}( v, s, d);

# workday
param wd{b in B, (v, s, d) in O} := 
  if b < s then 0 else if b - s > d - 1 then 0 else 1;

# leaveday
param ld{b in B, (v, s, d) in O} := 
  if b < s + d then 0 else if b - s > d + ml[v] - 1 then 0 else 1;

# work offer used
var x{(v,s,d) in O}, binary;

# minimze total wage
minimize wage :
  sum{b in B, (v,s,d) in O} x[v,s,d] * wd[b,v,s,d] * wa[v];

# worker can do one job only
s.t. j1{b in B, v in V} :
  sum{(v,s,d) in O} x[v,s,d] * ( wd[b,v,s,d] + ld[b,v,s,d] ) <= 1;

# do all jobs
s.t. ja{b in B} :
  sum{(v,s,d) in O} x[v,s,d] * wd[b,v,s,d] >= sum{(b, w) in L} w;

solve;

# output solution
printf "\n%-10s", "Day";
for {v in V}
  printf "| %-10s", v;
printf "\n";
printf "%-10s", '----------';
for {v in V}
  printf "+-%-10s", '----------';
printf "\n";
for {b in B}
{
  printf "%9i ", b;
  for {v in V}
    printf "| %-9s ", 
      if sum{(v,s,d) in O} x[v,s,d] * wd[b,v,s,d] then "working"  
      else "on leave";
  printf "\n";
}
printf "\n";

data;

# workload
set L := # day, workload
  ( 1, 3)
  ( 2, 1)
  ( 3, 1)
  ( 4, 1)
  ( 5, 1)
  ( 6, 2)
  ( 7, 2)
  ( 8, 2)
  ( 9, 3)
  (10, 2)
  (11, 2)
  (12, 2)
  (14, 1)
  (15, 2)
  (17, 3)
  (18, 3)
  (19, 2)
  (21, 3)
  (23, 1)
  (24, 3)
  (25, 3)
  (26, 3)
  (27, 2)
  (28, 1)
  (29, 1)
  (30, 2)
  (31, 1)
  (32, 3)
  (33, 2)
  (35, 3)
  (36, 3)
  (37, 1)
  (38, 3)
  (39, 2)
  (40, 3)
  (43, 1)
  (44, 1)
  (45, 2)
  (46, 2)
  (47, 3)
  (48, 2)
  (49, 1)
  (50, 2);

# workers
set W := # name, min workdays, max workdays, minimum leave, wage
  ( 'Anna',   5, 8, 2,  470 )
  ( 'Isabel', 5, 8, 2,  500 )
  ( 'Jack',   1, 8, 2, 1000 )
  ( 'John',   5, 8, 2,  600 )
  ( 'Lisa',   3, 5, 3,  640 );
end;
