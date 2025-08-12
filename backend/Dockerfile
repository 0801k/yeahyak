# -------- build stage --------
FROM gradle:8.7-jdk17 AS builder
WORKDIR /workspace

# (캐시 최적화) 루트 Gradle 래퍼/설정 먼저
COPY gradlew settings.gradle* build.gradle* gradle.properties gradle/ ./
# 백엔드 서브모듈의 빌드 스크립트 먼저
COPY backend/build.gradle* backend/gradle.properties backend/settings.gradle* ./backend/

# 의존성 프리페치(선택): 소스 없이도 가능한 범위에서 캐시
RUN gradle -p backend dependencies --no-daemon || true

# 실제 소스 복사
COPY backend/src ./backend/src

# 멀티모듈에서 backend가 다른 모듈(:common 등)에 의존한다면 여기도 복사 필요
# COPY common ./common

# 빌드 (테스트 생략)
RUN gradle -p backend clean bootJar --no-daemon -x test

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

# 타임존/비루트 유저(선택)
ENV TZ=Asia/Seoul
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# 산출물 복사 (백엔드 JAR)
COPY --from=builder /workspace/backend/build/libs/*.jar /app/app.jar

EXPOSE 8080
# 필요시 JVM 옵션 주입 가능: -e JAVA_OPTS="..."
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# Actuator 쓰면 헬스체크도 가능(이미지 슬림 유지를 위해 생략)
# HEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
