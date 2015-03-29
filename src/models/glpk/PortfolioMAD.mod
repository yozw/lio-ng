/**
# Portfolio Optimization using Mean Absolute Deviation

Source: http://en.wikibooks.org/wiki/GLPK/Portfolio_Optimization

Jeff Kantor
December 4, 2009

* Revised: December 6, 2009 to fix problem with random variate generation.
* Revised: December 7, 2009 to add a 'seeding' of the PRNG
* Revised: July 8, 2010 reformatted for GLPK Wikibook
*/


/* Stock Data */
set S;                                              # Set of stocks
param Rbar{S};                                      # Means of projected returns
param Sigma{S,S};                                   # Covariance of projected returns
param Rp  default (1/card(S))*sum{i in S} Rbar[i];  # Lower bound on portfolio return

/* Generate sample data */

/* Cholesky Lower Triangular Decomposition of the Covariance Matrix */
param C{i in S, j in S : i >= j} :=
    if i = j then
        sqrt(Sigma[i,i]-(sum {k in S : k < i} (C[i,k]*C[i,k])))
    else
        (Sigma[i,j]-sum{k in S : k < j} C[i,k]*C[j,k])/C[j,j];

 /* A workaround for the lack of a way to seed the PRNG in GMPL */
param utc := prod {1..2} (gmtime()-1000000000);
param seed := utc - 100000*floor(utc/100000);
check sum{1..seed} Uniform01() > 0;

/* Simulated returns */
param N default 5000;
set T := 1..N;
param R{i in S, t in T} := Rbar[i] + sum {j in S : j <= i} C[i,j]*Normal(0,1);

/* MAD Optimization */

var w{S};                     # Portfolio Weights with Bounds
var y{T} >= 0;                # Positive deviations (non-negative)
var z{T} >= 0;                # Negative deviations (non-negative)

minimize MAD: (1/card(T))*sum {t in T} (y[t] + z[t]);

s.t. C1: sum {s in S} w[s]*Rbar[s] >= Rp;
s.t. C2: sum {s in S} w[s] = 1;
s.t. C3 {t in T}: (y[t] - z[t]) = sum{s in S} (R[s,t]-Rbar[s])*w[s];

solve;

/* Report */

/* Input Data */
printf "\n\nStock Data\n\n";
printf "         Return   Variance\n";
printf {i in S} "%5s   %7.4f   %7.4f\n", i, Rbar[i], Sigma[i,i];

printf "\nCovariance Matrix\n\n";
printf "     ";
printf {j in S} " %7s ", j;
printf "\n";
for {i in S} {
    printf "%5s  " ,i;
    printf {j in S} " %7.4f ", Sigma[i,j];
    printf "\n";
}

/* MAD Optimal Portfolio */
printf "\n\nMinimum Absolute Deviation (MAD) Portfolio\n\n";
printf "  Return   = %7.4f\n",Rp;
printf "  Variance = %7.4f\n\n", sum {i in S, j in S} w[i]*w[j]*Sigma[i,j];
printf "         Weight\n";
printf {s in S} "%5s   %7.4f\n", s, w[s];
printf "\n";

data;

/* Data for monthly returns on four selected stocks for a three
year period ending December 4, 2009 */

# Simulation Horizon
param N := 5000;

# Minimum acceptable investment return
param Rp := 0.01;

# Historical returns on assets
param : S : Rbar :=
    AAPL    0.0308
    GE     -0.0120
    GS      0.0027
    XOM     0.0018 ;
    
# Covariance on asset returns
param   Sigma :
            AAPL    GE      GS      XOM  :=
    AAPL    0.0158  0.0062  0.0088  0.0022
    GE      0.0062  0.0136  0.0064  0.0011
    GS      0.0088  0.0064  0.0135  0.0008
    XOM     0.0022  0.0011  0.0008  0.0022 ;

end;
