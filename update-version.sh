#!/usr/bin/env bash

usage() {
  echo "Usage: update-version.sh -v [VERSION NUMBER]"
  echo "Required options:"
  echo "  -v    The version to increment the next release to"
}

while getopts "v:h" opt; do
  case $opt in
    v)
      echo "Updating GOCI project version number to $OPTARG"
      VERSION=$OPTARG
      ;;
    h)
      usage
      exit 0
      ;;
    \?)
      usage
      exit 1
      ;;
    :)
      echo "Missing option argument for -$OPTARG"
      exit 1
      ;;
    *)
      echo "Unimplemented option: -$OPTARG"
      exit 1
      ;;
  esac
done

if [ -z "$VERSION" ] ;
then
  echo "No version number supplied - please give a non-empty version number to increment to"
  exit 1
fi

base=${0%/*}/;

PROJECT_LIST='';

find $base -name 'pom.xml' | while read line; do
   if [[ $line != *'.//lodestar/'* ]]
      then
         sed -i '' "s/\(<zooma.version>\)\([^<]*\)\(<[^>]*\)/\1$VERSION\3/g" $line || exit 1
   fi
done

mvn -f $base/pom.xml -N versions:set -DnewVersion=$VERSION || exit 1

