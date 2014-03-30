## <h1>Linear Optimization Solver</h1>
##  
## <p>This is an online solver for linear optimization models, primarily developed for the book
## <a href="http://www.lio.yoriz.co.uk/">Linear and Integer Optimization: Theory and Practice</a>.</p>
##   
## <h3>Getting started</h3>
## <p>Choose any of the examples in the top menu to start with an example from the book, or create a
## <a>new model</a>.</p>
##   
## <h3>About linear optimization</h3>
## <p>Linear optimization (also called linear programming) is a mathematical method to achieve the best outcome
## (such as maximum profit or lowest cost) in a mathematical model whose requirements are represented by linear
## relationships. Linear optimization is a special case of mathematical optimization.</p>
## 
## <p>More formally, linear optimization is a technique for the optimization of a linear objective function, subject
## to linear equality and linear inequality constraints. Its feasible region is a convex polyhedron, which is a
## set defined as the intersection of finitely many half spaces, each of which is defined by a linear inequality.
## Its objective function is a real-valued affine function defined on this polyhedron. A linear optimization
## algorithm finds a point in the polyhedron where this function has the smallest (or largest) value if such a
##   point exists.
##   Linear optimization models can be expressed in the following canonical form:</p>
##
##   <div class="bs-callout bs-callout-info ng-binding">
##     <div class="display-math">
##     <table>
##       <tr>
##    <td>maximize</td><td><span class="math"><b>c</b><sup>T</sup><b>x</b></span></td>
##       </tr>
##       <tr>
##    <td>subject to</td><td><span class="math"><b>A</b><b>x</b>&nbsp;&le;&nbsp;<b>b</b></span></td>
##       </tr>
##       <tr>
##    <td></td><td><span class="math"><b>x</b>&nbsp;&ge;&nbsp;<b>0</b></span></td>
##       </tr>
##     </table>
##     </div>
##   </div>
##
## where <span class="math"><b>x</b></span> represents the vector of variables (to be determined),
## <span class="math"><b>c</b></span> and <span class="math"><b>b</b></span> are
## vectors of known coefficients, <span class="math"><b>A</b></span> is a known matrix of coefficients, and
## <span class="math">(&middot;)<sup>T</sup></span> is the matrix
## transpose. The expression to be maximized or minimized is called the objective function
## (<span class="math"><b>c</b><sup>T</sup><b>x</b></span> in this case).
## The inequalities <span class="math"><b>A</b><b>x</b>&nbsp;&le;&nbsp;<b>b</b></span> and
## <span class="math"><b>x</b>&nbsp;&ge;&nbsp;<b>0</b></span> are the constraints
## that specify the set of points over which the objective function is to be optimized.

var x1 >= 0;
var x2 >= 0;

maximize z:     3*x1 + 2*x2;

subject to c11:   x1 +   x2 <=  9;
subject to c12: 3*x1 +   x2 <= 18;
subject to c13:   x1        <=  7;
subject to c14:          x2 <=  6;

end;
