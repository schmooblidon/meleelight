#!/bin/bash
cd -
clear
echo There are 2 installation methods. Installing packages with node package manager(npm) or with yarn. Since you have node.js you have npm, but you will only have yarn if you downloaded it seperatly.
sleep 3s

start () {
read -p "would you like to install using yarn(a) or npm install(b):" Input

myParam=`echo "$Input" | tr 'a-z' 'A-Z'`
if ["A"=="$myParam"]; then
	yarn
if ["B"=="$myParam"]; then
	npm
else
	start
cls
}

yarn () {
yarn init
exit
}

npm () {
npm install
exit
}
