/**
# Simple single unit dispatch

Source: http://en.wikibooks.org/wiki/GLPK/Electricity_markets

Dr. H J Mackenzie, HARD software, hjm@hardsoftware.com, 2010-03-24
*/

# set of dispatch intervals
set I;

# dispatch price in $
param regionalprice {I};

# unit characteristics
param unit_max_capacity >= 0;
param fuel_cost >= 0;
param max_ramp_rate >= 0;
param start_dispatch >= 0;

# dispatch variables
var dispatch {I} >= 0;
var ramp {I}, >= - max_ramp_rate, <= max_ramp_rate;
var profit {I};

# objective function
maximize totalprofit: sum {i in I} profit[i];

# constraints

s.t. initial_dispatch: dispatch[0] = start_dispatch;
s.t. dispatch_profit {i in I}: profit[i] = 
  dispatch[i] * (regionalprice[i] - fuel_cost);
s.t. dispatch_ramp {i in I}: ramp[i] = 
  dispatch[i] - dispatch[if i > 0 then i-1 else 0];
s.t. unit_capacity {i in I}: dispatch[i] <= 
  unit_max_capacity;

# solve the problem
solve;

# output input and determined values
printf {i in I} "%d regionalprice = %.1f; dispatch = %.1f; ramp = %.1f; profit = %.1f\n",
    i, regionalprice[i], dispatch[i], ramp[i], profit[i];

data;

param unit_max_capacity := 100;  /* MW */
param fuel_cost := 30;           /* $/MWh */
param max_ramp_rate := 20;       /* max MW up or down */
param start_dispatch := 0;       /* present dispatch point MW */

param : I :   regionalprice :=
         0     15
         1     17
         2     18
         3     22
         4     55
         5     40
         6     65
         7     10
         8     12
         9      4
;

end;

