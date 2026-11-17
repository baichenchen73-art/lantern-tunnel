@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 地道
echo 正在下載最新版……
git pull --ff-only
if errorlevel 1 echo 無法更新（可能沒有網路），先用目前的版本開啟。
where npm >nul 2>nul
if errorlevel 1 goto browser
if not exist node_modules\electron (
  echo 第一次使用，正在安裝遊戲視窗，約需 1～2 分鐘……
  call npm install
)
if not exist node_modules\electron goto browser
echo 開啟遊戲中，關掉遊戲視窗後這個黑色視窗也會自動關閉。
call npm start
goto end
:browser
echo 用瀏覽器開啟遊戲。
start "" "%~dp0index.html"
:end
