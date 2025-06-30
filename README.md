# 📚 Blog Backend API

Bu proje, bir blog platformu için geliştirilmiş bir **RESTful API**'dir.  
Kullanıcılar makale oluşturabilir, yorum yapabilir ve rollere göre yetkilendirilebilir.

> 🔐 Kimlik doğrulama, 📝 içerik yönetimi ve 🎯 rol bazlı yetkilendirme içeren güçlü bir backend yapısı sunar.

---

## 🚀 Özellikler

- 👤 Kullanıcı kayıt ve giriş işlemleri  
- 🔐 JWT tabanlı kimlik doğrulama  
- ✉️ Şifre sıfırlama (e-posta ile)  
- 🧾 Kullanıcı profili güncelleme  
- 📝 Makale oluşturma, listeleme ve güncelleme  
- 💬 Yorum ekleme ve listeleme  
- 🛡️ Kullanıcı rolleri yönetimi (Admin yetkileri)  

---

## 🧱 Kullanılan Teknolojiler

| Teknoloji     | Açıklama                                |
|--------------|------------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)        | Sunucu tarafı JavaScript çalıştırma |
| ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)       | Web framework |
| ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white)    | ORM – Veritabanı ile nesne yönelimli erişim |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)                | Veritabanı |
| ![JWT](https://img.shields.io/badge/JWT-black?logo=jsonwebtokens)                             | Kimlik doğrulama |
| dotenv        | Ortam değişkenlerini yönetmek için        |
| Swagger       | API dokümantasyonu                        |
| Jest & Supertest | Test framework ve API testi            |

---

## ⚙️ Kurulum

### 1️⃣ Gereksinimler

- [Node.js](https://nodejs.org/) (v16+)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### 2️⃣ Projeyi Klonla

    git clone https://github.com/kullaniciadi/blog-backend-api.git
    cd blog-backend-api

    
    

### 3️⃣ Bağımlılıkları Kur

    npm install
    

### 4️⃣ Veritabanını Yapılandır

    a. Veritabanını oluştur:

        CREATE DATABASE blog_backend_api;

    b. src/config/database.js dosyasını kontrol et:

    const sequelize = new Sequelize('blog_backend_api', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    });

    c. Migrasyonları çalıştır:

        npx sequelize-cli db:migrate

    d. (Opsiyonel) Seed verilerini yükle:

        npx sequelize-cli db:seed:all

5️⃣ Ortam Değişkenlerini Ayarla
Proje kök dizininde .env dosyası oluştur:

    DB_NAME=blog_backend_api
    DB_USER=root
    DB_PASSWORD=password
    DB_HOST=localhost
    DB_DIALECT=mysql

    JWT_SECRET=your_jwt_secret
    PORT=3000

6️⃣ Sunucuyu Başlat

    npm start


## 📖 API Dokümantasyonu

API endpoint'leri Swagger ile belgelenmiştir. Projeyi çalıştırdıktan sonra tarayıcınızda aşağıdaki URL'yi açarak inceleyebilirsiniz:

    http://localhost:3000/api-docs

Swagger üzerinden tüm endpoint’leri test edebilir ve detaylı açıklamalarını görebilirsiniz.

## Testler
Testleri çalıştırmak için aşağıdaki komutu kullanabilirsiniz:

    npm test

