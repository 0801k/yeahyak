# -------- build stage --------
FROM gradle:8.7-jdk17 AS builder
WORKDIR /workspace

# Gradle Wrapper/설정 (backend 기준)
COPY gradlew gradlew.bat ./                #  둘 중 하나만 있어도 OK
COPY gradle/ ./gradle/                     #    폴더가 없으면 이 줄을 지우세요
COPY build.gradle ./build.gradle           #   필수
# settings.gradle이 없다면 이 줄을 지우세요
# COPY settings.gradle ./settings.gradle
# gradle.properties가 없다면 이 줄을 지우세요
# COPY gradle.properties ./gradle.properties

# 소스
COPY src ./src

RUN chmod +x ./gradlew || true
RUN ./gradlew clean bootJar --no-daemon -x test

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV TZ=Asia/Seoul
RUN addgroup --system app && adduser --system --ingroup app app
USER app

COPY --from=builder /workspace/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
