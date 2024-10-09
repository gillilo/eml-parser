# Node.js 기본 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

ENV BODY_SIZE_LIMIT=100000000

# 포트 설정
EXPOSE 3000

# 실행 명령 BODY_SIZE_LIMIT=100000000 node build
CMD ["node", "build"]