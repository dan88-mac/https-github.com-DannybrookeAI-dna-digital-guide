@echo off
setlocal
cd /d "%~dp0"
echo Opening contracts folder for PDF review...
start "" "%~dp0\03-contracts-pdf"
start "" "%~dp0\03-contracts-pdf\review\CONTRACT-REVIEW-CHECKLIST.md"
