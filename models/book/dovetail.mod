## # Model Dovetail
##
## The company Dovetail produces two kinds of matches: long and short ones. The company makes a
## profit of 3 (&times; \$1,000) for every 100,000 boxes of long matches, and
## 2 (&times; \$1,000) for every 100,000 boxes of short matches. The company has one
## machine that can produce both long and short matches, with a total of at most 9 (&times; 100,000)
## boxes  per year. For the production of matches the company needs wood and boxes: three cubic meters
## of wood are needed for 100,000 boxes of long matches, and one cubic meter of wood is needed for
## 100,000 boxes of short matches. The company has 18 cubic meters of wood available for the next year.
## Moreover, Dovetail has 7 (&times; 100,000) boxes for long matches, and 6 (&times; 100,000) for
## short matches available at its production site. The company wants to maximize its profit in the
## next year. It is assumed that Dovetail can sell any amount it produces.
##
## We introduce the *decision variables* $x_1$ and $x_2$:
##
## * $x_1 =$ the number of boxes (&times; 100,000) of long matches to be made the next year, and
## * $x_2 =$ the number of boxes (&times; 100,000) of short matches to be made the next year.
##
##
## The company makes a profit of 3 (&times; \$1,000) for every 100,000 boxes of long matches,
## which means that for $x_1$ (&times; 100,000) boxes of long matches, the profit
## is $3x_1$ (&times; \$1,000). Similarly, for $x_2$ (&times; 100,000) boxes of short matches
## the profit is $2x_2$ (&times; \$1,000). Since Dovetail aims at maximizing its profit, and it is assumed
## that Dovetail can sell its full production, the *objective* of Dovetail is:
## \[
## \max  3x_1 + 2x_2.
## \]
## The function $3x_1 + 2x_2$ is called the *objective function* of the problem. It is a function
## of the decision variables $x_1$ and $x_2$. If we only consider the objective function, it is obvious that the
## production of matches should be taken as high as possible. However, the company also has to take  into account a
## number of *constraints*. First, the machine capacity is 9 (&times; 100,000) boxes
## per year. This yields the constraint:
## \begin{equation}
##   x_1 + x_2 \leq 9.
## \end{equation}
## Second, the limited amount of wood yields the constraint:
## \begin{equation}
##   3x_1 + x_2 \leq 18.
## \end{equation}
## Third, the numbers of available boxes for long and short matches is restricted, which means that $x_1$ and $x_2$ have to satisfy:
## \begin{equation}
##   x_1 \leq 7, \mbox{ and } x_2 \leq 6.
## \end{equation}
## The above inequalities are called *technology constraints*.
## Finally, we assume that only nonnegative amounts can be produced, i.e.,
## \[ x_1, x_2 \geq 0. \]
## The inequalities $x_1 \geq 0$ and $x_2 \geq 0$ are called *nonnegativity constraints*. Taking
## together the six expressions formulated above, we obtain Model Dovetail:
## <div class="display">
## <table class="lo-model">
## <tr><td>$\max$</td><td>$3x_1$</td><td>$+$</td><td>$2x_2$</td></tr>
## <tr><td>$\mbox{subject to}$</td><td>$x_1$</td><td>$+$</td><td>$x_2$</td><td>$\leq$</td><td>$9$</td></tr>
## <tr><td></td><td>$3x_1$</td><td>$+$</td><td>$x_2$</td><td>$\leq$</td><td>$18$</td></tr>
## <tr><td></td><td>$x_1$</td><td></td><td></td><td>$\leq$</td><td>$7$</td></tr>
## <tr><td></td><td></td><td></td><td>$x_2$</td><td>$\leq$</td><td>$6$</td></tr>
## <tr><td></td><td colspan="4">$x_1, x_2 \geq 0.$</td></tr>
## </table>
## </div>

var x1 >= 0;
var x2 >= 0;

maximize z:     3*x1 + 2*x2;

subject to c11:   x1 +   x2 <=  9;
subject to c12: 3*x1 +   x2 <= 18;
subject to c13:   x1        <=  7;
subject to c14:          x2 <=  6;

end;
