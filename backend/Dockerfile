# -------- build stage --------
FROM gradle:8.7-jdk17 AS builder
WORKDIR /workspace

# 프로젝트 전체 복사 (gradle 이미지의 gradle 유저 권한으로)
COPY --chown=gradle:gradle . .

# Gradle 캐시 사용 + 상세 로그로 진단 용이하게
RUN --mount=type=cache,target=/home/gradle/.gradle \
    gradle clean bootJar -x test --no-daemon --stacktrace --info

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV TZ=Asia/Seoul
RUN groupadd -r app && useradd -r -g app -s /usr/sbin/nologin app

# 빌드 산출물 복사
COPY --from=builder /workspace/build/libs/*.jar /app/app.jar
RUN chown app:app /app/app.jar

USER app
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
