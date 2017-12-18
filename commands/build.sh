#!/bin/bash
cd -
clear
echo "There are 2 build types - developer and production. Developer build updates changes, while production is the optimized build."
echo "Would you like to build dev (a) or production (b) version: "
read input_variable
echo "You entered: ${input_variable}"

    case ${input_variable} in
        a ) npm run dev; break;;
        b )  npm run build;;
    esac
exit
