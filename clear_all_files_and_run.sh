#!/bin/bash
npm run build && \
find . -mindepth 1 -maxdepth 1 ! -name 'package*.json' ! -name '.output' ! -name '.env' ! -name 'clear_all_files_and_run.sh' -exec rm -rf {} + && \
npm run start