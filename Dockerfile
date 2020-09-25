FROM nginx:1.15-alpine
WORKDIR /usr/share/nginx/html
COPY . .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]