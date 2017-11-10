#!/bin/bash

ember build -e production
echo "/*    /index.html   200" > dist/_redirects
netlify deploy
