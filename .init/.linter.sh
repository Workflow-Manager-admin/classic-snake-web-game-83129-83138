#!/bin/bash
cd /home/kavia/workspace/code-generation/classic-snake-web-game-83129-83138/snake_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

