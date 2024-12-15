#!/bin/bash
read -p "Are you sure to reset Database? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Ressetting Database..."
    npx prisma migrate reset --force
fi