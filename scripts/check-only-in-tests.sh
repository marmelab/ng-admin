#!/bin/bash
SRC=$(git rev-parse --show-toplevel)
EXCLUDE="--exclude-dir 'node_modules' --exclude-dir '.git'"

#==========================================================
# Check if I forgot to remove 'only' keyword from tests.
# To make sure that before commit run all tests
only_command="grep -c -h -r $EXCLUDE -E \"(describe|it)\.only\" $SRC | awk -F ':' '{x +=\$0}; END {print x}'"
fonly_command="grep -c -h -r $EXCLUDE -E \"f(it|describe)\(\" $SRC | awk -F ':' '{x +=\$0}; END {print x}'"
only=`eval $only_command`
fonly=`eval $fonly_command`

if (( $((only + fonly)) > 0 ))
then
  echo 'Remove ONLY from tests.'
  # Output list of found only entries
  eval "grep -r -n $EXCLUDE -E \"(describe|it)\.only\" $SRC"
  eval "grep -r -n $EXCLUDE -E \"f(it|describe)\(\" $SRC"
  exit 1
fi
