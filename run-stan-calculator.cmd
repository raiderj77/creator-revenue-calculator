@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read STAN-CALCULATOR-PROMPT.md in this directory and execute it exactly, non-interactively. Write the final report to STAN-CALCULATOR-REPORT.md in this directory." < NUL > stan-calculator.log 2>&1
