#!/bin/sh

echo "STARTING BADGE_SERVER"
node lib/server.js BADGE_SERVER > badge.log &
echo "STARTG BADGE_SERVER DONE"