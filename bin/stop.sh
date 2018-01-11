#!/bin/sh
PROCESS_NAME="BADGE_SERVER"
KILLED=0

PID=`ps -fea | grep $PROCESS_NAME | grep -v grep | awk '{print $2}'`
if [ -z "$PID" ]
then
        echo "Process with name [$PROCESS_NAME] was not found."
        eod $1
        exit 1
fi


echo "SHUTING DOWN BADGE_SERVER" > badge.log
echo "Finishing process with id: [$PID]"
kill -9 $PID > /dev/null 2>&1