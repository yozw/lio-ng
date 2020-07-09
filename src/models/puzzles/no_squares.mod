/**

# No squares

This integer optimisation model finds a placement of red and green tokens so that neither red nor
green forms a "square".

The model code can be found under "Model" on the left. Click "Solve" to solve the model. Once
the model is solved, click on "Solution > Output" to see the solution.

## 5x5 example

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

# We want exactly player 2 to put exactly ceil(N^2/2) tokens on the board.
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
