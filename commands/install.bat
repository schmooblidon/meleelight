@echo off
cd..
cls
echo There are 2 installation methods. Installing packages with node package manager(npm) or with yarn. Since you have node.js you have npm, but you will only have yarn if you downloaded it seperatly.
pause

:start
set /p Input=would you like to install using yarn(a) or npm install(b):

if /I "%Input%"=="a" (goto yarn)
if /I "%Input%"=="b" (goto npm)else (goto start)
cls

:yarn
yarn init
EXIT /B

:npm
npm install
EXIT /B
