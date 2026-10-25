@echo off
cd /d C:\Users\jason\empire\creator-revenue-calculator-current
opencode run --auto "Read ARTICLE-SPRINT-REPAIR-PROMPT.md in this directory and execute it exactly, non-interactively. Append the repair report to ARTICLE-SPRINT-REPORT.md as instructed." < NUL > article-sprint-repair.log 2>&1
