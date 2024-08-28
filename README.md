# Contact-Book
FullStack App built on Express, Typescript and MongoDB to manager contacts.

This project is a simple CRUD application destinated to backend studies.

(2024-28-08) Contact is a fullstack app with endpoints to:  
  - login and register users with authentication
  - add, remove and edit contacts in a book with name, phone, email and a profile pic
  - edit your profile with name, phone, email, password and a profile pic
  - search contacts in a search bar by name or number (actually it isn't an endpoint, it's just JS however it's one of the main functionalities)

Important considerations about this project:
  - This is my first fullstack app and by studies reason, i built alone the whole project
  - It has just the basic config of typescript with Node.js and SQL Postgres
  - Authentication logic was made using JWT by passport lib
  - The user's password are encrypted by bcrypt lib
  - Images manipulation was made by multer and sharp
  - Database schema was made by prisma
  - The architecture of the project consists in MVC with services whereas model is the prisma

## Some project's images next:

![image](https://github.com/user-attachments/assets/f6575e36-7c7f-4876-b0b4-aa92ad716d79)

![image](https://github.com/user-attachments/assets/8f082b03-7091-4b3a-ba6e-4a5a28f52a08)

![image](https://github.com/user-attachments/assets/cacc5b79-901d-406f-bb63-d78e50d854bb)

![image](https://github.com/user-attachments/assets/ef5313e2-49d7-467f-9469-b9c335ef21eb)

![image](https://github.com/user-attachments/assets/9a82b7e1-2370-44ca-8eb0-a113449fed57)

![image](https://github.com/user-attachments/assets/a0fb27b0-993e-452b-bd8a-402fee7f272a)

![image](https://github.com/user-attachments/assets/7f31c3ae-252a-4f3a-8206-36f44adb7163)

![image](https://github.com/user-attachments/assets/0efad276-f377-400f-94cf-e682277e5eb3)

![image](https://github.com/user-attachments/assets/0e3dccfe-a1dc-4fa3-b851-36be55316bcc)

## Installation
After cloning:
```bash
npm install
```

To config enviroment variables, copy `.env.example` to `.env.`:
```bash
cp .env.example .env
```

## Use
To run the project, use the default command:
```bash
npm run dev
```

