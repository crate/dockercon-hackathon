#!/bin/sh

until $(curl --output /dev/null --silent --head --fail http://crate:4200); do
    printf '.'
    sleep 3
done

cd /usr/src/app

npm run serve
