# A puzzle
Source: Nicky van Foreest (http://nicky.vanforeest.com/misc/numberPuzzle/puzzle.html)

Consider the following puzzle: Chose numbers 1 to 5 such that in the diagram below each number
is contained exactly once in each row and each column. The numbers in the fields should respect
any inequality between two fields.

<table border=0 style="border-collapse: collapse; text-align: center;">
  <tr style="height: 40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;">&gt;</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;">4</td>
  </tr>
  <tr style="height: 20px">
    <td>&and;</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>&or;</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
  </tr>
  <tr style="height: 20px">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
  </tr>
  <tr style="height: 20px">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>&or;</td>
    <td></td>
    <td></td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;">4</td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;">&lt;</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;">&gt;</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;">2</td>
  </tr>
  <tr style="height: 20px">
    <td>&and;</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>&or;</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:20px;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
  </tr>
</table>

## The decision variables
As decision variables we use $x_{r,c,k}$ such that $x_{r,c,k}=1$ if $k$ appears in the field
with row $r$ and column $c$.

## Objective
The objective is trivial, as there is nothing to optimize. We only need to find a feasible solution.

## Constraints
There should be precisely one value in each field:
\[ \sum_{k = 1}^N x_{r,c,k} = 1 \mbox{ for } r = 1, \ldots, N \mbox{ and } c = 1, \ldots N. \]
Each value must be used exactly once in each row:
\[ \sum_{c = 1}^N x_{r,c,k} = 1 \mbox{ for } r = 1, \ldots, N \mbox{ and } k = 1, \ldots N. \]
Each value must be used exactly once in each column:
\[ \sum_{r = 1}^N x_{r,c,k} = 1 \mbox{ for } c = 1, \ldots, N \mbox{ and } k = 1, \ldots N. \]

Formulating the inequality constraints requires a bit more work. Lets consider an example. In the problem diagram
above we see that the value of field $2,1$ must be larger than the value in field $1,1$. Thus, if field $2,1$ has
value 3, then field $1,1$ is not allowed to have a value of 3, 4, or 5. As a consequence, if $x_{2,1,3} = 1$, then
$\sum_{w=3}^5 x_{1,1,w} = 0$. More generally, we want that
\[ x_{2,1,k} = 1 \Rightarrow \sum_{w=k}^5 x_{1,1,w} = 0.\]
We can implement this implication with the big $M$ trick. Choose some big $M$, then set
\[ \sum_{w=k}^5 x_{1,1,w} \leq M(1-x_{2,1,k}), \]
so that if $x_{2,1,k} = 1$, then $\sum_{w=k}^5 x_{1,1,w}$ must be zero, while if $x_{2,1,k} = 0$, the sum
$\sum_{w=k}^5 x_{1,1,w}$ is, in practice, unconstrained.

The starting numbers that appear in the diagram above form a simple set of constraints:
\[
x_{1,5,4} = 1, x_{4,1,4} = 1, x_{4,5,2} = 1.
\]
*/

param N;             # number of rows = number of columns
param M;             # large enough constant

set R := 1 .. N;

set INEQ, within R cross R cross R cross R;  
set FIX, within R cross R cross R;

var x{R, R, R} >= 0, <= 1, binary;

# There should be precisely one value in each field.
subject to values{r in R, c in R}:
  sum{k in R} x[r, c, k] = 1;

# There should be only one value per row  
subject to rows{r in R, k in R}:
  sum{c in R} x[r, c, k] = 1;

# There should be only one value per column
subject to columns{k in R, c in R}:
  sum{r in R} x[r, c, k] = 1;

subject to ineqConstr{(r1, c1, r2, c2) in INEQ, k in R}:
  sum{w in k..N} x[r1, c1, w] <= M * (1 - x[r2, c2, k]);

subject to fixConstr{(r, c, k) in FIX}:
  x[r, c, k] = 1;
  
solve;

printf "The following is a solution to the puzzle:\n";
for {r in R} {
  for {c in R} {
    for {k in R : x[r, c, k] == 1} {
      printf "%2d", k;
    }
  }
  printf "\n";
}

data;

param N := 5;
param M := 100;

# Set of quadruples (r1, c1, r2, c2) specifying inequalities among the entries,
# specifying that the entry is row r1, column c1 should be less than the entry
# in row r2, column r2.
set INEQ := (1, 1, 2, 1) (1, 5, 1, 4) (2, 5, 1, 5) (4, 4, 3, 4)
         (4, 1, 5, 1) (4, 3, 4, 4) (4, 5, 4, 4) (5, 5, 4, 5);

# Set of triples (r, c, k) specifying that the entry in row r, column k should
# be equal to k.
set FIX := (1, 5, 4) (4, 1, 4) (4, 5, 2);

end;
