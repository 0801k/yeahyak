# -------- build stage --------
FROM gradle:8.7-jdk17 AS builder
WORKDIR /workspace

# Gradle Wrapper & 설정 (캐시 레이어 최적화)
COPY gradlew gradlew.bat ./
COPY gradle/ ./gradle/
COPY build.gradle ./build.gradle
COPY settings.gradle ./settings.gradle


# 소스
COPY src ./src

# 실행 권한 및 빌드 (BuildKit 캐시로 속도 ↑)
RUN chmod +x ./gradlew || true
# Buildx/BuildKit 환경에서 cache mount 사용
RUN --mount=type=cache,target=/root/.gradle/caches \
    --mount=type=cache,target=/root/.gradle/wrapper \
    ./gradlew clean bootJar --no-daemon -x test

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV TZ=Asia/Seoul
# 비루트 사용자 생성 (Ubuntu/Debian 계열)
RUN groupadd -r app && useradd -r -g app -s /usr/sbin/nologin app

# JAR 복사 + 소유권 지정
COPY --chown=app:app --from=builder /workspace/build/libs/*.jar /app/app.jar

USER app
EXPOSE 8080

# 메모리 자동 조절(컨테이너 친화 옵션)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# exec form: 신호/종료 코드 전달 안전
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
