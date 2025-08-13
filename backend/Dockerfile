FROM eclipse-temurin:21-jre
WORKDIR /app

ENV TZ=Asia/Seoul
RUN groupadd -r app && useradd -r -g app -s /usr/sbin/nologin app

# CI에서 만든 JAR을 복사 (파일명이 바뀌어도 *.jar로 대응)
COPY --chown=app:app build/libs/*.jar /app/app.jar

USER app
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]