FROM node:24 AS builder
WORKDIR /app
COPY . . 

RUN npm install
RUN npm run build
RUN echo $(ls /app/dist)

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]