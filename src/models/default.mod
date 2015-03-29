/**
# Linear Optimization Solver

This is an online solver for linear optimization models, primarily developed for the book
[Linear and Integer Optimization: Theory and Practice](http://www.lio.yoriz.co.uk/).

## Getting started
Choose any of the examples in the top menu to start with an example from the book, or create a
<a>new model</a>.

## About linear optimization
Linear optimization (also called linear programming) is a mathematical method to achieve the best outcome
(such as maximum profit or lowest cost) in a mathematical model whose requirements are represented by linear
relationships. Linear optimization is a special case of mathematical optimization.

More formally, linear optimization is a technique for the optimization of a linear objective function, subject
to linear equality and linear inequality constraints. Its feasible region is a convex polyhedron, which is a
set defined as the intersection of finitely many half spaces, each of which is defined by a linear inequality.
Its objective function is a real-valued affine function defined on this polyhedron. A linear optimization
algorithm finds a point in the polyhedron where this function has the smallest (or largest) value if such a
point exists.

Linear optimization models can be expressed in the following standard form:

begin{equation}
\begin{array}{ll}
\max & \mathbf{c}^{\sf T}\mathbf{x} \\
\mbox{s.t.} & \mathbf{A}\mathbf{x} \leq \mathbf{b} \\
            & \mathbf{x} \geq \mathbf{0}.
\end{array}
\end{equation}

where $\mathbf{A}$ is an $m\times n$ matrix (the *technology matrix*), $\mathbf{c}$ is an
$n$-vector (the *objective vector*), and $\mathbf{b}$ is an $m$-vector (the
*right hand side vector*). The vector $\mathbf{x}$ contains the decision variables, whose values
are to be determined. The expression $\mathbf{c}^{\sf T}\mathbf{x}$ to be maximized is called the
*objective function*. The inequalities $\mathbf{A}\mathbf{x} \leq \mathbf{b}$ and
$\mathbf{x} \geq \mathbf{0}$ are the *constraints* that specify the set of feasible points
over which the objective function is to be maximized.
*/

var x1 >= 0;
var x2 >= 0;

maximize z:     3*x1 + 2*x2;

subject to c11:   x1 +   x2 <=  9;
subject to c12: 3*x1 +   x2 <= 18;
subject to c13:   x1        <=  7;
subject to c14:          x2 <=  6;

end;
