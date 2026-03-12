.PHONY: run build docker deps

run:
	./mvnw spring-boot:run

build:
	./mvnw clean package -DskipTests

docker: build
	docker build -t gcr.io/agendamentosgk/backend .
	# docker push gcr.io/agendamentosgk/backend

deps:
	./mvnw dependency:resolve
