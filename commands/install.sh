#!/bin/bash
cd-
clear
echo "There are 2 installation methods. Installing packages with node package manager(npm) or with yarn. Since you have node.js you have npm, but you will only have yarn if you downloaded it seperatly."

echo "Please choose (a) yarn or (b) npm: "
read input_variable
echo "You entered: ${input_variable}"

    case ${input_variable} in
        a ) yarn init; break;;
        b )  npm install;;
    esac
exit
