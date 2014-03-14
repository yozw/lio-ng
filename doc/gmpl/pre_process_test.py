import unittest

from pre_process import replace_math_env, to_mathjax, combine_math



class TestPreProcess(unittest.TestCase):
  def test_replace_math_env(self):
    self.assertEqual(replace_math_env("x"), "x")        
    self.assertEqual(replace_math_env("@math{x}"), "$x$")
    self.assertEqual(replace_math_env("@math{x}@math{x}"), "$x$ $x$")
    self.assertEqual(replace_math_env("@math{x} @math{x}"), "$x$ $x$")        
    self.assertEqual(replace_math_env("x @math{x} @math{x} x"), "x $x$ $x$ x") 
    
  def test_to_mathjax(self):
    self.assertEquals(to_mathjax("$@leq$"), r"$\leq$")
    self.assertEquals(to_mathjax("x$@leq$y"), r"x$\leq$y")
    self.assertEquals(to_mathjax("$$@leq$$"), r"$$\leq$$")
    self.assertEquals(to_mathjax("$@leq$ $$@geq$$"), r"$\leq$ $$\geq$$")
    self.assertEquals(to_mathjax("$@leq$@sin$@geq$"), r"$\leq$@sin$\geq$")
    self.assertEquals(to_mathjax("$@leq$@sin$$@geq$$"), r"$\leq$@sin$$\geq$$")
    self.assertEquals(to_mathjax("$$@leq$$@sin$$@geq$$"), r"$$\leq$$@sin$$\geq$$")
    self.assertEquals(to_mathjax("$$@leq\\eqno(5)$$"), r"$$\begin@{equation@}\leq\tag@{5@}\end@{equation@}$$")
    self.assertEquals(to_mathjax("x$$@leq\\eqno(5)$$y"), r"x$$\begin@{equation@}\leq\tag@{5@}\end@{equation@}$$y")

  def test_combine_math(self):
    self.assertEquals(combine_math("$a$,$b$"), r"$a,b$")
    self.assertEquals(combine_math("$a$, $b$"), r"$a, b$")
    self.assertEquals(combine_math("$a$, $b$, $c$"), r"$a, b, c$")
  
    
if __name__ == '__main__':
    unittest.main()
    
