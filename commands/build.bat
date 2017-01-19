@echo off
cd..
cls

:start
set /p Input=would you like to build the dev version(a) or production version(b) of the game:

if /I "%Input%"=="a" (goto dev)
if /I "%Input%"=="b" (goto production)else (goto start)
cls

:dev
npm run dev
EXIT /B

:production
npm run build
EXIT /B
