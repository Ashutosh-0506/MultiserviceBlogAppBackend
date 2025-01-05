# Multi-Service App with Docker and PostgreSQL

This project is a Node.js-based multi-service application that uses Docker and PostgreSQL for deployment and orchestration. It consists of three core services: User Service, Blog Service, and Comment Service.

---

## **Table of Contents**
1. [Features](#features)
2. [Services Overview](#services-overview)
3. [Setup and Deployment](#setup-and-deployment)
    - [Prerequisites](#prerequisites)
    - [Local Development](#local-development)
    - [Docker Deployment](#docker-deployment)
    - [AWS Deployment](#aws-deployment)
4. [Environment Variables](#environment-variables)
5. [API Documentation](#api-documentation)
    - [User Service](#user-service)
    - [Blog Service](#blog-service)
    - [Comment Service](#comment-service)
6. [Database Schema](#database-schema)
7. [ Multi-Service Application](#Multi-server-Application)

---

## **Features**
- **Microservices Architecture**: 
  - User, Blog, and Comment services operate independently.
- **Authentication**: 
  - JWT-based authentication for secure user sessions.
- **Database**: 
  - PostgreSQL with separate schemas for each service.
- **Containerization**: 
  - Each service is Dockerized for consistent deployments.
- **Scalability**: 
  - Supports horizontal scaling using Docker Compose and AWS.
- **Robust API**: 
  - Fully documented and easy-to-use REST API for each service.

---

## **Services Overview**
1. **User Service**:
    - Handles user registration, authentication, and profile management.
    - Exposed Endpoints:
        - `POST /register`: Register a new user.
        - `POST /login`: Authenticate a user.

2. **Blog Service**:
    - Manages blog posts with CRUD operations.
    - Exposed Endpoints:
        - `POST /blogs`: Create a blog post.
        - `GET /blogs`: List blog posts (supports pagination).
        - `GET /blogs/:id`: Fetch a specific blog post.
        - `PUT /blogs/:id`: Update a blog post.
        - `DELETE /blogs/:id`: Delete a blog post.

3. **Comment Service**:
    - Manages comments for blog posts.
    - Exposed Endpoints:
        - `POST /comments`: Add a comment to a blog post.
        - `GET /comments?post_id=<id>`: List comments for a specific blog post.

---

## **Setup and Deployment**

### **Prerequisites**
- [Docker](https://www.docker.com/products/docker-desktop) (>= v20.10)
- [Docker Compose](https://docs.docker.com/compose/install/) (>= v1.29)
- AWS EC2 instance (optional for cloud deployment)
- Node.js (for local development) and npm

---

### **Local Development**
1. Clone the repository:
    ```bash
    git clone https://github.com/<your-username>/multi-service-app.git
    cd multi-service-app
    ```

2. Install dependencies for each service:
    ```bash
    cd user-service && npm install
    cd ../blog-service && npm install
    cd ../comment-service && npm install
    ```

3. Create a `.env` file for each service in the respective directories. Example for `user-service`:
    ```plaintext
    DB_USER=postgres
    DB_PASSWORD=admin
    DB_HOST=localhost
    DB_NAME=multiapp
    JWT_SECRET=supersecret
    DB_PORT=5432
    ```

4. Start the services:
    ```bash
    docker-compose up --build
    ```

5. Access services:
    - **User Service**: `http://localhost:4000`
    - **Blog Service**: `http://localhost:4001`
    - **Comment Service**: `http://localhost:4002`

---

### **Docker Deployment**
1. Build and push Docker images:
    ```bash
    docker build -t <your-dockerhub-username>/user-service ./user-service
    docker build -t <your-dockerhub-username>/blog-service ./blog-service
    docker build -t <your-dockerhub-username>/comment-service ./comment-service
    ```

2. Push images to Docker Hub:
    ```bash
    docker push <your-dockerhub-username>/user-service
    docker push <your-dockerhub-username>/blog-service
    docker push <your-dockerhub-username>/comment-service
    ```

3. Update the `docker-compose.yml` file to use the pushed images.

4. Start the services:
    ```bash
    docker-compose up -d
    ```

---

### **AWS Deployment**
1. Launch an EC2 instance and install Docker:
    ```bash
    sudo yum update -y
    sudo yum install docker
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

2. Transfer files to EC2:
    ```bash
    scp -i <your-key.pem> docker-compose.yml ec2-user@<your-ec2-ip>:~/multi-service-app/
    ```

3. Pull Docker images on EC2:
    ```bash
    docker pull <your-dockerhub-username>/user-service
    docker pull <your-dockerhub-username>/blog-service
    docker pull <your-dockerhub-username>/comment-service
    ```

4. Start services on EC2:
    ```bash
    docker-compose up -d
    ```

---

## **Environment Variables**
Ensure each service has its own `.env` file with the following keys:
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Hostname for the database
- `DB_NAME`: Database name
- `DB_PORT`: Database port
- `JWT_SECRET`: Secret key for JWT

---

## **API Documentation**
### **User Service**
- **POST /register**: Register a new user
    - Payload:
      ```json
      {
        "username": "testuser",
        "password": "testpass123"
      }
      ```

- **POST /login**: Authenticate user and receive a JWT
    - Payload:
      ```json
      {
        "username": "testuser",
        "password": "testpass123"
      }
      ```

### **Blog and Comment Services**
- Refer to the routes in the respective service directories.

---

## **Database Schema**
- **Users Table**:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    ```

- **Blogs Table**:
    ```sql
    CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id INT REFERENCES users(id)
    );
    ```

- **Comments Table**:
    ```sql
    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INT REFERENCES blogs(id),
        author_id INT REFERENCES users(id)
    );
    ```

    # Multi-Service Application

This repository contains a multi-service application deployed on AWS EC2, including the User Service, Post Service, and Comment Service. Below are the details of each service and how to access them.

---

## **Services Deployed on AWS EC2**

### **1. User Service**
- **Description**: Handles user-related operations (e.g., authentication, user profiles, etc.).
- **URL**: [User Service](http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:443)
- **Port**: `443`

### **2. Post Service**
- **Description**: Manages posts, including creating, reading, updating, and deleting posts.
- **URL**: [Post Service](http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:80)
- **Port**: `80`

### **3. Comment Service**
- **Description**: Handles comments on posts, including adding and retrieving comments.
- **URL**: [Comment Service](http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:22)
- **Port**: `22`

---

## **AWS EC2 Section**

The application is deployed on an AWS EC2 instance. Below are the key details:

- **Instance Type**: t2.micro
- **Region**: eu-north-1
- **Public DNS**: [ec2-51-20-64-84.eu-north-1.compute.amazonaws.com](http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com)
- **Security Groups**:
  - Port 80: Open for Post Service
  - Port 443: Open for User Service
  - Port 22: Open for Comment Service (Typically used for SSH; consider remapping)

---

## **How to Test the Services**

### **1. Using Postman**
- **User Service Health Check**: 
  - URL: `http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:443/users/health`
  - Method: `GET`
- **Post Service Health Check**:
  - URL: `http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:80/posts/health`
  - Method: `GET`
- **Comment Service Health Check**:
  - URL: `http://ec2-51-20-64-84.eu-north-1.compute.amazonaws.com:22/comments/health`
  - Method: `GET`

---


---
