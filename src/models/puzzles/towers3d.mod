/**
# Placing skyscrapers (3D)
Source: Gaxex / Nicky van Foreest

Consider the following puzzle: Place the numbers 1 through 5 in the diagram below such that each
number appears exactly once in each row and each column. The diagram represents a city map,
drawn from above. Each square represents a skyscraper, and the
number in the square represents its height. The numbers on the sides of the diagram represent the
number of skyscrapers that should be visible from each point. So, for instance, the number 2 left of
the top-left square means that two skyscrapers in the top row should be visible when
you are standing at a left of the top row (ignoring perspective). The row can be filled in with,
for example, the numbers 3, 1, 2, 5, 4; the skyscrapers with heights 3 and 5 are visible, while the
skyscrapers with heights 1, 2, 4 are hidden by taller skyscrapers closer to you, i.e., the skyscraper
with height 3 blocks the view on the skyscrapers with heights 1 and 2, and the skyscraper with height
5 blocks to view on the skyscraper with height 4.

<div align="center">
<table border=0 style="border-collapse: collapse; text-align: center;">
  <tr style="height: 40px">
    <td style="width:40px;"></td>
    <td style="width:40px;">3</td>
    <td style="width:40px;">1</td>
    <td style="width:40px;">2</td>
    <td style="width:40px;">4</td>
    <td style="width:40px;">2</td>
    <td style="width:40px;"></td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;">2</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">3</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;">2</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">3</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;">5</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">1</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;">1</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">4</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;">2</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">2</td>
  </tr>
  <tr style="height: 40px">
    <td style="width:40px;"></td>
    <td style="width:40px;">2</td>
    <td style="width:40px;">3</td>
    <td style="width:40px;">3</td>
    <td style="width:40px;">1</td>
    <td style="width:40px;">2</td>
    <td style="width:40px;"></td>
  </tr>
</table>
</div>

## The decision variables
We use binary decision variables $x_{i,j,k}$ such that $x_{i,j,k} = 1$ if $k$ appears in position $(i, j)$,
i.e., if the skyscraper in position $(i, j)$ has height $k$.
We also introduce binary variables $ve_{i,j}$ such that $ve_{i,j} = 1$ if and only if the skyscraper
at position $(i, j)$ is visible from the east. Similarly, we introduce binary variables $vw_{i,j}$,
$vn_{i,j}$, and $vs_{i,j}$ for visibility from the west, north, and south, respectively.

## Objective
The objective is trivial, as there is nothing to optimize. We only need to find a feasible solution.

## Constraints
There should be precisely one value in each field:
\[ \sum_{k = 1}^N x_{i,j,k} = 1 \mbox{ for } i = 1, \ldots, N \mbox{ and } j = 1, \ldots N. \]
Each value must be used exactly once in each row:
\[ \sum_{j = 1}^N x_{i,j,k} = 1 \mbox{ for } i = 1, \ldots, N \mbox{ and } k = 1, \ldots N. \]
Each value must be used exactly once in each column:
\[ \sum_{i = 1}^N x_{i,j,k} = 1 \mbox{ for } j = 1, \ldots, N \mbox{ and } k = 1, \ldots N. \]

For modeling the relationship between the values of the $x_{i,j,k}$'s and the values of $ve_{i,j}$,
$vw_{i,j}$, $vn_{i,j}$, and $vs_{i,j}$, we refer to the `Placing skyscrapers (2D)' puzzle.
The constraints for the 3D puzzle are analogous to the ones in the 2D puzzle.
*/

param N;

param EAST{i in 1..N};
param WEST{i in 1..N};
param NORTH{i in 1..N};
param SOUTH{i in 1..N};

# x[i, j, k] = 1 iff the tower in row i and column j has height k
var x{1..N, 1..N, 1..N} binary;

# ve[i, j] = 1 iff the tower in row i and column j is visible from the east
var ve{1..N, 1..N} binary;

# vw[i, j] = 1 iff the tower in row i and column j is visible from the west
var vw{1..N, 1..N} binary;

# vn[i, j] = 1 iff the tower in row i and column j is visible from the north
var vn{1..N, 1..N} binary;

# vs[i, j] = 1 iff the tower in row i and column j is visible from the south
var vs{1..N, 1..N} binary;

# Every tower has exactly one height
subject to tower{i in 1..N, j in 1..N}:
  sum{k in 1..N} x[i, j, k] = 1;

# Every height is used exactly once in every row
subject to heights_r{i in 1..N, k in 1..N}:
  sum{j in 1..N} x[i, j, k] = 1;

# Every height is used exactly once in every column
subject to heights_c{j in 1..N, k in 1..N}:
  sum{i in 1..N} x[i, j, k] = 1;

# Visibility from the east
subject to ve1{i in 1..N, j in 1..N, k in 1..N}:
  ve[i, j] >= x[i, j, k] - sum{a in 1..(j-1), b in k..N} x[i, a, b];

subject to ve2{i in 1..N, j in 1..N, k in 1..N}:
  ve[i, j] <= 2 - x[i, j, k] - sum{a in 1..(j-1), b in k..N} x[i, a, b] / 25;

subject to east{i in 1..N}:
  sum{j in 1..N} ve[i, j] = EAST[i];

# Visibility from the west
subject to vw1{i in 1..N, j in 1..N, k in 1..N}:
  vw[i, j] >= x[i, j, k] - sum{a in (j+1)..N, b in k..N} x[i, a, b];

subject to vw2{i in 1..N, j in 1..N, k in 1..N}:
  vw[i, j] <= 2 - x[i, j, k] - sum{a in (j+1)..N, b in k..N} x[i, a, b] / 25;

subject to west{i in 1..N}:
  sum{j in 1..N} vw[i, j] = WEST[i];

# Visibility from the north
subject to vn1{i in 1..N, j in 1..N, k in 1..N}:
  vn[i, j] >= x[i, j, k] - sum{a in 1..(i-1), b in k..N} x[a, j, b];

subject to vn2{i in 1..N, j in 1..N, k in 1..N}:
  vn[i, j] <= 2 - x[i, j, k] - sum{a in 1..(i-1), b in k..N} x[a, j, b] / 25;

subject to north{j in 1..N}:
  sum{i in 1..N} vn[i, j] = NORTH[j];

# Visibility from the north
subject to vs1{i in 1..N, j in 1..N, k in 1..N}:
  vs[i, j] >= x[i, j, k] - sum{a in (i+1)..N, b in k..N} x[a, j, b];

subject to vs2{i in 1..N, j in 1..N, k in 1..N}:
  vs[i, j] <= 2 - x[i, j, k] - sum{a in (i+1)..N, b in k..N} x[a, j, b] / 25;

subject to south{j in 1..N}:
  sum{i in 1..N} vs[i, j] = SOUTH[j];

solve;

printf "Solution:\n";
printf "    ";
for {j in 1..N} {
   printf "%d ", sum{i in 1..N} vn[i, j];
}
printf "\n  +-----------+\n";
for {i in 1..N} {
  printf "%d | ", sum{j in 1..N} ve[i, j];
  for {j in 1..N} {
    printf "%d ", sum{k in 1..N} k * x[i, j, k];
  }
  printf "| %d", sum{j in 1..N} vw[i, j];
  printf "\n";
}
printf "  +-----------+\n";
printf "    ";
for {j in 1..N} {
   printf "%d ", sum{i in 1..N} vs[i, j];
}
printf "\n";

data;

param N := 5;

param EAST :=
  1 2
  2 2
  3 5
  4 1
  5 2;

param WEST :=
  1 3
  2 3
  3 1
  4 4
  5 2;

param NORTH :=
  1 3
  2 1
  3 2
  4 4
  5 2;

param SOUTH :=
  1 2
  2 3
  3 3
  4 1
  5 2;

end;
