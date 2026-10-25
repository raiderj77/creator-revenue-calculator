@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read STAN-CALCULATOR-RUN2-PROMPT.md in this directory and execute it exactly, non-interactively. Write the final report to STAN-CALCULATOR-RUN2-REPORT.md in this directory." < NUL > stan-calculator-run2.log 2>&1
