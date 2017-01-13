#!/bin/bash
cd -
clear

start () {

read -p "would you like to install using yarn(a) or npm install(b):" Input

myParam=`echo "$Input" | tr 'a-z' 'A-Z'`
if ["A"=="$myParam"]; then
	dev
if ["B"=="$myParam"]; then
	production
else
	start
cls
}

dev () {
npm run dev
exit
}

production () {
npm run build
exit
}
