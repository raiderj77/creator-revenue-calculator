@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read AFFILIATE-PASS-PROMPT.md in this directory and execute it exactly, non-interactively. Write the final report to AFFILIATE-PASS-REPORT.md in this directory." < NUL > affiliate-pass.log 2>&1
