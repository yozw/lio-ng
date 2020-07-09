/**

# No squares

This integer optimisation model finds a placement of red and green tokens so that neither red nor
green forms a "square".

The model code can be found under "Model" on the left. Click "Solve" to solve the model. Once
the model is solved, click on "Solution > Output" to see the solution.

## Model

Let $N$ be the length of one side of the board (e.g., $N = 5$).
For $i\in\{1, ..., N\}$ and $j\in\{1, ..., N\}$, define the variable $x_{ij}$ with the following interpretation:
$$
x_{i,j} = \begin{cases}
0 & \mbox{ if the cell in row $i$, column $j$ is occupied by a red token;} \\
1 & \mbox{ if the cell in row $i$, column $j$ is occupied by a green token.}
\end{cases}
$$

We want to choose values for these $x_{ij}$'s such that following constraints are satisfied.
First, we want that player 1 to puts exactly $\lfloor N^2/2\rfloor$ tokens on the board.
Equivalently, player 2 puts exactly $\lceil N^2/2\rceil$ tokens on the board. That is,
$$
\sum_{i=1}^N \sum_{j=1}^N x_{i,j} = \left\lceil \frac{N^2}{2}\right\rceil.
$$

We now want to ensure that neither player creates a square. To do so, we consider every possible square
as follows. First, we pick a corner of the square; let's say this corner has coordinate $(i, j)$. Next, we
pick a displacement vector $(k, l)$ so that the next corner is $(i+k, j+l)$. Once this is chosen, the other two
corners are $(i+k-l)$ and $(i-l, j+k)$.

Now we add a constraint for every possible choice of $i, j, k, l$ that results in a square on the board. Note that
for some choices if $i, j, k, l$, the resulting corners are not on the board. It is a routine matter to work
out under what conditions $i, j, k, l$ result in a valid square:
$$
\begin{align*}
& i\in \{1, ..., N\},
& j\in \{1, ..., N\},
& k \in \{1, ..., N-i\},
& l \in \{0, ..., \min(N-j-k, i-1)\}.
\end{align*}
$$

For every such choice of $i, j, k, l$, we want that among the cells in positions $(i,j)$, $(i+k, j+l)$, $(i+k-l, j+k+l)$, $(i-l, j+k)$,
there is at least one red token and at least one green token. In other words, we want at least one but at most three
green tokens in those cells. This translates to:
$$
1 \leq x_{ij} + x_{i+k,j+l} + x_{i+k-l,j+k+l} + x_{i-l, j+k} \leq 3.
$$

The question is therefore: find a an assignment of zeros and ones to $x_{i, j}$ such that the above constraints are
satisfied.


## 5x5 example

Here is an example solution for the case $N=5$:

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

*/

# Size of the board.
param N >= 1;

# x[i, j] is equal to 0 if square (i, j) contains player 1's token and is
# equal to 1 if it contains player 2's token.
var x{1..N, 1..N}, binary;

# We don't want to optimise anything; we just want to find *a* solution.
maximize z: 0;

# We want player 2 to put exactly ceil(N^2/2) tokens on the board.
# (And hence player 1 puts exactly floor(N^2/2) tokens on the board.)
subject to total:
  sum{i in 1..N, j in 1..N} x[i, j] = ceil((N*N)/2);

# Player 1 has no squares of the form:
#        (i-l, j+k)
#      /     \
# (i, j)      \
#    \      (i+k-l, j+k+l)
#     \      /
#   (i+k, j+l)
subject to no_square_player1 {i in 1..N, j in 1..N, k in 1..N-i, l in 0..min(N-j-k, i-1)}:
  x[i, j] + x[i+k, j+l] + x[i+k-l, j+k+l] + x[i-l, j+k]  >= 1;

# Same as above, for player 2.
subject to no_square_player2 {i in 1..N, j in 1..N, k in 1..N-i, l in 0..min(N-j-k, i-1)}:
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
