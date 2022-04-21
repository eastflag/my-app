#!/bin/bash

STORY_NO=$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+/)?(\w+[-_])?[0-9]+' | grep -Eo '(\w+[-])?[0-9]+' | cut -d- -f2 | tr "[:lower:]" "[:upper:]")
STORY_PREFIX='/'
FILE=$1 
MESSAGE=$(cat $FILE)

if [ $STORY_NO != "" ]; then
  echo "$STORY_NO$STORY_PREFIX$MESSAGE" > $FILE 
fi