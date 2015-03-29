/**
 # The diet problem
 A doctor prescribes to a patient exact amounts of daily vitamin A and vitamin C intake. Specifically, the patient
 should choose her diet so as to consume exactly 3 milligrams of vitamin A and exactly 75 milligrams of vitamin C.
 The patient considers eating three kinds of food, which contain different amounts of vitamins and have different
 prices. She wants to determine how much of each food she should buy in order to minimize her total expenses, while
 making sure to ingest the prescribed amounts of vitamins. Let $x_{i}$ be the amount of food $i$ that she should buy
 ($i = 1,2,3$). Each unit of food 1 contains $1$ milligram of vitamin A and 30 milligrams of vitamin C, each unit
 of food 2 contains 2 milligrams of vitamin A and $10$ milligrams of vitamin C, and each unit of food 3 contains
 2 milligrams of vitamin A and 20 milligrams of vitamin C. The unit cost of food 1, 2, and 3  is \$40, \$100, and
 \$150 per week, respectively. This problem can be formulated as follows:

 <div class="display">
 <table class="lo-model">
 <tr><td>$\max$</td><td>$40x_1$</td><td>$+$</td><td>$100x_2$</td><td>$+$</td><td>$150x_3$</td></tr>
 <tr><td>$\mbox{subject to}$</td><td>$x_1$</td><td>$+$</td><td>$2x_2$</td><td>$+$</td><td>$2x_3$</td><td>$=$</td><td>$3$</td></tr>
 <tr><td></td><td>$30x_1$</td><td>$+$</td><td>$10x_2$</td><td>$+$</td><td>$20x_3$</td><td>$=$</td><td>$75$</td></tr>
 <tr><td></td><td colspan="6">$x_1, x_2, x_3 \geq 0.$</td></tr>
 </table>
 </div>
*/

var x1 >= 0;
var x2 >= 0;
var x3 >= 0;

minimize z:
    40 * x1 + 100 * x2 + 150 * x3;
    
subject to vitaminA:
    x1 + 2 * x2 + 2 * x3 = 3;
    
subject to vitaminC:
    30 * x1 + 10 * x2 + 20 * x3 = 75;
    
end;

