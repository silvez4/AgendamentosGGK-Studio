.PHONY: install run build clean docker

install:
	npm install

run:
	npm run dev

build:
	npm run build

clean:
	rm -rf node_modules .nuxt .output

docker: build
	docker build -t gcr.io/agendamentosgk/frontend .
