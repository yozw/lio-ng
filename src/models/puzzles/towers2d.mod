/**
# Placing skyscrapers (2D)
Source: Gaxex / Nicky van Foreest

Consider the following puzzle. Place the numbers 1 through 5 in the diagram below such that each
number is used exactly once. The diagram represents a city map, drawn from
above. Each square represents a skyscraper, and the number in the square represents its height. The
numbers on the left and on the right of the diagram represent the number of skyscrapers that should be
visible from the left and from the right, respectively. So, for instance, the number 2 means that two
skyscrapers should be visible (ignoring the perspective) when you are standing on the west side of the
city.

<div align="center">
<table border=0 style="border-collapse: collapse; text-align: center;">
  <tr style="height: 40px">
    <td style="width:40px;">2</td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px;">3</td>
  </tr>
</table>
<br>
</div>

For example, if the towers have heights 3, 1, 2, 5, 4, respectively, then the
skyscrapers with heights 3 and 5 are visible from the left, while the skyscrapers with heights 1, 2, 4 are
hidden by taller skyscrapers, i.e., the skyscraper with height 3 blocks the view on the
skyscrapers with heights 1 and 2, and the skyscraper with height 5 blocks to view on the skyscraper
with height 4. Similarly, the skyscrapers with heights 4 and 5 are visible from the right.
This situation is illustrated in the figure below, in which the city is show from the
south side.

<div align="center">
<table border=0 style="border-collapse: collapse; text-align: center;">
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
  </tr>
</table>
<br>
</div>


## The decision variables
We use binary decision variables $x_{i,k}$ such that $x_{i,k} = 1$ if $k$ appears in position $i$.
We also introduce binary variables $vl_i$ such that $vl_i = 1$ if and only if skyscraper $i$ is
visible from the left, and binary variables $vr_i$ such that $vr_i = 1$ if and only if skyscraper
$i$ is visible from the right.

## Objective
The objective is trivial, as there is nothing to optimize. We only need to find a feasible
solution.

## Constraints
There should be precisely one value in each position:
\[ \sum_{k = 1}^N x_{i,k} = 1 \mbox{ for } i = 1, \ldots, N. \]
Each value must be used exactly once:
\[ \sum_{i = 1}^N x_{i,k} = 1 \mbox{ for } k = 1, \ldots N. \]

For each $i = 1, \ldots, N$ and $k = 1, \ldots, N$, define
\begin{align*}
L(i, k) & = \{ (a, b) \ |\  a = 1, \ldots, i-1; b = k, \ldots, N \} \\
\mbox{ and } R(i, k) & = \{ (a, b) \ |\  a = i+1, \ldots, N; b = k, \ldots, N \}.
\end{align*}
The set $L(i, k)$ contains all combinations of building positions $a$ and heights $k$ that can
block the view onto a skyscraper of height $k$ at position $i$, when viewing from the left.
$R(i, k)$ is defined analogously for the view from the right. As an example, consider the diagram
below. This diagram depicts the skyscrapers when viewed from the south side. The gray area
represents a skyscraper of height 3 at position 3. The blue area represents $L(4, 3)$. The gray
skyscraper is visible from the left if and only if no skyscraper has its top floor in the blue
area. In other words, it is visible if and only if $\sum_{(a,b)\in L(i, k)} x_{a,b} < 0$.

<div align="center">
<table border=0 style="border-collapse: collapse; text-align: center;">
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #6af;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
  <tr style="height:40px">
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #888;"></td>
    <td style="width:40px; border: 1px solid black; background-color: #f4f8fa;"></td>
  </tr>
</table>
<br>
</div>

Observe that
the skyscraper at position $i$ has height $k$ and the top floor is visible from the left
if and only if $\sum_{(a,b)\in L(i, k)} x_{a,b} < x_{i, k}$.
The latter holds only when $x_{i,k} = 1$ and $\sum_{(a,b)\in R(i, k)} x_{a,b} = 0$.
So, in order to model the value of $vl_i$ correctly, we need to ensure that:

\[
vl_i = 1 \mbox{ if and only if } \sum_{(a,b)\in L(i, k)} x_{a,b} < x_{i, k} \mbox{ for some } k \in \{1, \ldots, N\}.
\]

We model this equivalence through the following constraints:
\begin{align*}
vl_i & \geq x_{i, k} - \sum_{(a,b)\in L(i, k)} x_{a,b}          & & \mbox{for all } i, k; \\
vl_i & \leq 2 - x_{i, k} - \sum_{(a,b)\in L(i, k)} x_{a,b} / 25 & & \mbox{for all } i, k.
\end{align*}
We leave it to the reader to check that these constraints correctly model the relationship.
We now require that exactly two skyscrapers are visible from the left, and so we introduce the constraint:
\[
vl_1 + \ldots + vl_N = 2.
\]
Similary, for the visibility from the right, we introduce the constraints:
\begin{align*}
vr_i & \geq x_{i, k} - \sum_{(a,b)\in R(i, k)} x_{a,b}          & & \mbox{for all } i, k; \\
vr_i & \leq 2 - x_{i, k} - \sum_{(a,b)\in R(i, k)} x_{a,b} / 25 & & \mbox{for all } i, k; \\
& vr_1 + \ldots + vr_N = 3.
\end{align*}
*/

param N;

var x{1..N, 1..N} binary;
var vl{1..N} binary;
var vr{1..N} binary;

# Every tower has exactly one height
subject to tower{i in 1..N}:
  sum{k in 1..N} x[i, k] = 1;

# Every height is used exactly once
subject to heights{k in 1..N}:
  sum{i in 1..N} x[i, k] = 1;

# Visibility from the left
subject to vl1{i in 1..N, k in 1..N}:
  vl[i] >= x[i, k] - sum{a in 1..(i-1), b in k..N} x[a, b];

subject to vl2{i in 1..N, k in 1..N}:
  vl[i] <= 2 - x[i, k] - sum{a in 1..(i-1), b in k..N} x[a, b] / 25;

# Visibility from the right
subject to vr1{i in 1..N, k in 1..N}:
  vr[i] >= x[i, k] - sum{a in (i+1)..N, b in k..N} x[a, b];

subject to vr2{i in 1..N, k in 1..N}:
  vr[i] <= 2 - x[i, k] - sum{a in (i+1)..N, b in k..N} x[a, b] / 25;

subject to left:
  sum{i in 1..N} vl[i] = 2;

subject to right:
  sum{i in 1..N} vr[i] = 3;

solve;

printf "Tower heights:\n";
for {i in 1..N} {
  printf "%d ", sum{k in 1..N} k * x[i, k];
}

printf "\nBuildings with heights ";
for {i in 1..N : vl[i] == 1} {
  printf "%d ", sum{k in 1..N} k * x[i, k];
}

printf "are visible from the left.\nBuildings with heights ";
for {i in 1..N : vr[i] == 1} {
  printf "%d ", sum{k in 1..N} k * x[i, k];
}
printf "are visible from the right.\n";

data;

param N := 5;

end;
