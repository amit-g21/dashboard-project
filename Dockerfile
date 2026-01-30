FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Clean the default public folder
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output (Double-check this path matches your local dist folder)
COPY --from=build /app/dist/dashboard-project/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]