sudo git pull origin main
docker stop axlegames-backend-server
docker rm axlegames-backend-server
docker rmi axlegames/backend-server
docker build --no-cache -t axlegames/backend-server .
docker run -p 5000:5000 -p 587:587 --restart=always --name axlegames-backend-server -d --env-file .env axlegames/backend-server
docker system prune -a -f
docker ps -a