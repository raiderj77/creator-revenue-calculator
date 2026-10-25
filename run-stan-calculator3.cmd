@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read STAN-CALCULATOR-RUN3-PROMPT.md in this directory and execute it exactly, non-interactively. Write the final report to STAN-CALCULATOR-RUN3-REPORT.md in this directory." < NUL > stan-calculator-run3.log 2>&1
