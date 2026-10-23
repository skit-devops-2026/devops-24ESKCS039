.PHONY: install test build run docker-build docker-up k8s-apply

install: ; cd User && npm ci && cd ../admin && npm ci && cd .. && npm install

test: ; node tests/basic.test.js

build: ; cd User && npm run build && cd ../admin && npm run build

run: ; node server.js

docker-build: ; docker build -t elara-app:latest .

docker-up: ; docker compose up --build -d

k8s-apply: ; kubectl apply -f k8s/
