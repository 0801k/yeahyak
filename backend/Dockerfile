# -------- build stage --------
FROM gradle:8.7-jdk17 AS builder
WORKDIR /workspace

# Gradle Wrapper/설정 (backend 디렉터리 기준)
COPY gradlew gradlew.bat gradle/ ./
COPY settings.gradle* build.gradle* gradle.properties ./

# 소스 복사
COPY src ./src

# 의존성 미리 받기(캐시 목적) - 실패해도 계속
RUN chmod +x ./gradlew && ./gradlew dependencies --no-daemon || true

# 빌드 (테스트 생략)
RUN ./gradlew clean bootJar --no-daemon -x test

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV TZ=Asia/Seoul
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# 빌드 산출물 복사
COPY --from=builder /workspace/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
