ecr = 339712886798.dkr.ecr.eu-central-1.amazonaws.com
instance = ec2-user@ec2-18-156-175-214.eu-central-1.compute.amazonaws.com

login:
	aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $(ecr)

build:
	docker build --platform=linux/amd64 -t $(ecr)/websites/fart:latest .

push:
	docker push $(ecr)/websites/fart:latest

cp:
	scp -i ~/.ssh/fart-website-kp.pem ./docker-compose.prod.yaml $(instance):/home/ec2-user

down:
	DOCKER_HOST=ssh://$(instance) docker compose -f docker-compose.prod.yaml down

up:
	DOCKER_HOST=ssh://$(instance) docker compose -f docker-compose.prod.yaml up -d --build

rm:
	DOCKER_HOST=ssh://$(instance) docker image rm $(ecr)/websites/fart

logs:
	DOCKER_HOST=ssh://$(instance) docker logs fart-payload-1

ssh:
	ssh -i "~/.ssh/fart-website-kp.pem" $(instance)

update:
	DOCKER_HOST=ssh://$(instance) docker compose -f docker-compose.prod.yaml pull
	DOCKER_HOST=ssh://$(instance) docker compose -f docker-compose.prod.yaml up -d --build
