/**

# No squares

This integer optimisation model finds a placement of red and green tokens so that neither red nor
green forms a "square". Squares don't have to be aligned with the grid, but - as tends to be true
for squares - the lengths of their sides have to be equal.

The model code can be found under "Model" on the left. Click "Solve" to solve the model. Once
the model is solved, click on "Solution > Output" to see a visualisation of the solution.

## 5x5 example

Here is an example "square-free" 5 x 5 board:

<style>
.mytable {
  border-collapse: collapse;
  text-align: center;
}

.mytable td {
  border: 1px solid black;
  padding: 4px;
}

.red-dot {
  height: 25px;
  width: 25px;
  background-color: #c44;
  border-radius: 50%;
  display: block;
}

.green-dot {
  height: 25px;
  width: 25px;
  background-color: #4b4;
  border-radius: 50%;
  display: block;
}
</style>

<table border=0 class="mytable">
  <tr>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
  </tr>
  <tr>
    <td><div class="red-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="green-dot"></div></td>
  </tr>
  <tr>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="red-dot"></div></td>
  </tr>
  <tr>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
  </tr>
  <tr>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="green-dot"></div></td>
    <td><div class="red-dot"></div></td>
    <td><div class="green-dot"></div></td>
  </tr>
</table>

## Model

Let $N$ be the length of one side of the board (e.g., $N = 5$).
For $i\in\{1, ..., N\}$ and $j\in\{1, ..., N\}$, define the binary variable $x_{ij}$, with the following interpretation:
$$
x_{i,j} = \begin{cases}
0 & \mbox{ if the cell in row $i$, column $j$ is occupied by a red token;} \\
1 & \mbox{ if the cell in row $i$, column $j$ is occupied by a green token.}
\end{cases}
$$

We want to choose values for these $x_{ij}$'s such that following constraints are satisfied.

(1) **The board contains exactly $\lceil N^2/2\rceil$ green tokens.** That is:
$$
\sum_{i=1}^N \sum_{j=1}^N x_{i,j} = \left\lceil \frac{N^2}{2}\right\rceil.
$$
This ensure that there are roughly as many green tokens as there are red tokens on the board; the difference
is at most one.

(2) **Neither red nor green creates a square.** To model this, we consider every possible square
as follows. First, we pick a corner of the square. Let's say this corner has coordinate $(i, j)$. Next, we
pick a "displacement vector" $(k, l)$. This displacement vector is the first picked corner and a
corner adjacent to it. That second corner is $(i+k, j+l)$. Once this is chosen, the third and fourth
corners are $(i+k-l)$ and $(i-l, j+k)$.

Note that for some choices of $i, j, k, l$, one or more of the resulting corners are not actually on the board. 
It is left as an exercise to show choosing $i, j, k, l$ under the following constraints captures all
valid squares:
$$
\begin{align*}
& i\in \{1, ..., N\}, \\
& j\in \{1, ..., N\}, \\
& k \in \{1, ..., N-i\}, \\
& l \in \{0, ..., \min(N-j-k, i-1)\}.
\end{align*}
$$

For every such choice of $i, j, k, l$, we want to ensure that among the cells in positions
$(i,j)$, $(i+k, j+l)$, $(i+k-l, j+k+l)$, $(i-l, j+k)$,
there is at least one red token and at least one green token. In other words, we want at least one but at most three
green tokens in those cells. This translates to:
$$
1 \leq x_{ij} + x_{i+k,j+l} + x_{i+k-l,j+k+l} + x_{i-l, j+k} \leq 3.
$$

The problem is now reduced to: find a an assignment of zeros and ones to $x_{i, j}$ such that the above constraints are
satisfied.


*/

# Size of the board.
param N >= 1;

# x[i, j] is equal to 0 if square (i, j) contains a red token and is
# equal to 1 if it contains a green token.
var x{1..N, 1..N}, binary;

# We don't want to optimise anything; we just want to find *a* solution.
maximize z: 0;

# We want exactly ceil(N^2/2) green tokens on the board.
# (And hence exactly floor(N^2/2) red tokens on the board.)
subject to total:
  sum{i in 1..N, j in 1..N} x[i, j] = ceil((N*N)/2);

# Red has no squares of the form:
#        (i-l, j+k)
#      /     \
# (i, j)      \
#    \      (i+k-l, j+k+l)
#     \      /
#   (i+k, j+l)
subject to no_square_red {i in 1..N, j in 1..N, k in 1..N-i, l in 0..min(N-j-k, i-1)}:
  x[i, j] + x[i+k, j+l] + x[i+k-l, j+k+l] + x[i-l, j+k]  >= 1;

# Same as above, for green.
subject to no_square_green {i in 1..N, j in 1..N, k in 1..N-i, l in 0..min(N-j-k, i-1)}:
  x[i, j] + x[i+k, j+l] + x[i+k-l, j+k+l] + x[i-l, j+k] <= 3;

# Solve this integer optimisation problem.  
solve;

# Print out the solution.
for {i in 1..N} {
  printf("|");
  for {j in 1..N} {
    printf(if x[i, j] == 0 then "X|" else " |");
  }
  printf("\n");
}
  
data;

# Data for this instance.
param N := 5;

end;
