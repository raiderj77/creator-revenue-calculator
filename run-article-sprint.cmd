@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read ARTICLE-SPRINT-PROMPT.md in this directory and execute it exactly, non-interactively. Write the final report to ARTICLE-SPRINT-REPORT.md in this directory." < NUL > article-sprint-run.log 2>&1
