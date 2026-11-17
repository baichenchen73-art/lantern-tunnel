@echo off
chcp 65001 >nul
cd /d "%~dp0"
git pull --ff-only
start "" "%~dp0index.html"
