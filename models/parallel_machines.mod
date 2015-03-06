## # Scheduling jobs on parallel machines with precedence constraints
## Source: Nicky van Foreest (http://nicky.vanforeest.com/scheduling/projectSchedulingWithWorkforceConstraints/parallelMachines.html)
## 
## Let's consider Example 4.2.3 of [APin08], but now such that tasks has to be
## carried out by a number of parallel and identical machines. The aim is to
## compute the makespan as a function of the number of machines. This problem is
## much more difficult than the critical path problem as discussed in Section 4.2 of
## [APin08], but a bit simpler than the project scheduling problem with machine 
## constraints of Section 4.6, as now all machines are identical.
##
## ## Problem formulation
## Let $N$ be the number of jobs and let $W$ be the number of machines. For each job $j$, let $p_j$
## be its processing time.
## Let $E$ be a set of pairs $(j, k)$ of jobs such that job $j$ should be completed before job
## $k$ can be started. For example $(1, 2)$ means that we have to complete job $1$ before we can start
## executing job $2$. The pairs in the set $E$ represent the *precedence constraints*.
## Our goal is to execute the jobs on the $W$ machines in a minimum amount of time, while respecting the
## precedence constraints.
##
## ## Model formulation
## Finally, let $T$ be the maximum amount of time it may take to process the jobs (e.g., choose
## $T = \sum_{j=1}^N p_j$).
## The decision variables are (with $j=1, \ldots, N$ and $t = 1, \ldots, T$):
## \[ 
## \begin{array}{ll}
## x_{jt} & = \begin{cases} 1 & \mbox{if task $j$ finishes at time $t$} \\ 0 & \mbox{else,} \end{cases} \\
## C_j & = \mbox{the completion time of task $j$}, \\
## C_{\rm max} & = \mbox{the completion time of the last task}.
## \end{array}
## \]
## The completion time of task $j$ in terms of $x_{jt}$ is:
## \[ C_j  = \sum_{j=1}^T t x_{jt}, \mbox{ for } j = 1,\ldots,N. \]
## The completion time $C_{\rm max}$ of the last task $j$ should satisfy:
## \[ C_{\rm max} \geq C_{j}, \mbox{ for } j = 1,\ldots,N. \]
## Each job has to be scheduled precisely once:
## \[ \sum_{t=1}^T x_{jt} = 1, \mbox{ for } j = 1,\ldots,N. \]
## A job's completion time must be at least equal to its processing time:
## \[ C_j \geq p_j, \mbox{ for } j = 1,\ldots,N. \]
## A job $j$ can only finish when its predecessors are finished:
## \[ C_j \geq C_k + p_j, \mbox{ for } (k, j) \in E. \]
## Finally, overlapping processing times of jobs are not allowed to exceed the number of parallel machines $W$. 
## For this purpose we define the function $p(j,t)$ such that $p(j,t)=1$ if task $j$ finishes between time $t$
## and $t+p_j$, and $0$ elsewhere:
## \[ p(j, t) = \sum_{u=t}^{\min(T, t+p_j+1)} x_{ju}, \mbox{ for } j=1,\ldots,N \mbox{ and } t = 1,\ldots,T. \]
## With this, it follows straightaway that:
## \[ \sum_{j=1}^N p(j, t) \leq W, \mbox{ for } t = 1,\ldots,T. \]
##
## ## References
## [APin08]	M.L. Pinedo. *Planning and Scheduling in Manufacturing and Services*. Springer, 2nd edition, 2008.

param N;   # number of jobs
param W;   # number of machines
param T;   # maximum amount of time

param p{1..N};   # processing time for each job


var x{1..N, 1..T} binary;
var C{1..N} >= 0;
var Cmax >= 0;

set E within 1..N cross 1..N;

minimize z: Cmax;

subject to once{j in 1..N}:
  sum {t in 1..T} x[j, t] = 1;

subject to completion{j in 1..N}:
  C[j] >= p[j];

subject to pred{(k, j) in E}:
  C[j] >= C[k] + p[j];

subject to Cmax_def{j in 1..N}:
  Cmax >= C[j];

subject to defC{j in 1..N}:
  C[j] = sum {t in 1..T} t * x[j, t];

subject to maxMachines{t in 1..T}:
  sum{j in 1..N} sum{s in t..min(T, t + p[j] - 1)} x[j, s] <= W;

solve;

for {j in 1..N} {
  printf "Job %d completes at time %d.\n", j, C[j];
}

data;

param N := 14;
param W := 1;

param p := 
  1 5
  2 6
  3 9
  4 12
  5 7
  6 12
  7 10
  8 6
  9 10
  10 9
  11 7
  12 8
  13 7
  14 5;
  
param T := 120;
  
set E := (1,2) (2,4) (4,7) (7,10) (10,12), (12, 14)
         (1,3) (3,6) (3,5) (6,9) (6,8) (5,9) (5,8) (9,11) (8,11)
         (11,12), (11,13), (13,14);

end;

