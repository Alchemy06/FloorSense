FROM eclipse-temurin:21-jdk AS builder
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle/ ./gradle/
COPY src/ ./src/

RUN ./gradlew build -x test

FROM eclipse-temurin:22-jre-alpine
RUN apk update && apk upgrade --no-cache

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
