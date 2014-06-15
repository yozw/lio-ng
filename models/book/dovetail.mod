## # Model Dovetail
##
## This model is the running example of the book.
## \begin{equation}
## \begin{array}{lrcrcr}
## \max        & 3x_1 & + & 2x_2 \\
## \mbox{s.t.} &  x_1 & + &  x_2 & \leq &  9 \\
##             & 3x_1 & + &  x_2 & \leq & 18 \\
##             & 3x_1 &   &      & \leq & 7 \\
##             &      &   &  x_2 & \leq & 6  \\
##             & x_1, x_2 & \geq & 0.
## \end{array}
## \end{equation}

var x1 >= 0;
var x2 >= 0;

maximize z:     3*x1 + 2*x2;

subject to c11:   x1 +   x2 <=  9;
subject to c12: 3*x1 +   x2 <= 18;
subject to c13:   x1        <=  7;
subject to c14:          x2 <=  6;

end;


