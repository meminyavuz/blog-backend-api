# Node.js tabanlı bir Docker görüntüsü kullan
FROM node:16

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala ve bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# config.json dosyasını doğru yere kopyala
COPY src/config /app/config

# Uygulama dosyalarını kopyala
COPY . .
COPY scripts/wait-for-it.sh /usr/local/bin/wait-for-it

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000

# wait-for-it ile MySQL'in hazır olmasını bekle ve uygulamayı başlat
CMD ["wait-for-it", "rabbitmq:5672", "--", "npm", "start"]