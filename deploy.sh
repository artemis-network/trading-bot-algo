sudo git pull origin main
docker stop tradingbot-algo-container 
docker rm tradingbot-algo-container 
docker rmi tradingbot-algo-server
docker build --no-cache -t tradingbot-algo-server .
docker run -p 5000:5000 -p 587:587 --restart=always --name tradingbot-algo-container -d --env-file .env tradingbot-algo-server
docker system prune -a -f
docker ps -a