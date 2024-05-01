#!/bin/bash
export PATH=$PATH:/root/.nvm/versions/node/v20.9.0/bin

cd ~/survey

npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 delete survey
pm2 start npm --name "survey" -- start


# POSTGRESS_DATABASE_PASSWORD="$1"

# # DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@164.68.103.23:1001/survey?schema=public"
# # ADMIN_EMAIL="atulmorchhlay204@gmail.com"
# # ADMIN_PASSWORD=$POSTGRESS_DATABASE_PASSWORD


# docker stop survey
# docker rm 
# docker rmi atul24112001/survey

# cd ~/survey
# docker build -t atul24112001/survey:latest .
# docker run -e ADMIN_EMAIL=$ADMIN_EMAIL \
#     -e ADMIN_PASSWORD=$ADMIN_PASSWORD \
#     -e DATABASE_URL=$DATABASE_URL \
#     --name survey \
#     --network backend_bridge \
#     -d -p 3004:3000 atul24112001/survey:latest
