# SDA Bible Reading Check-in System (SDA读经打卡系统)

## 🛠 技术栈
- Frontend: React + TailwindCSS (Vite)
- Backend: Laravel 12 + MySQL 8.0
- Database: MySQL 8.0

## 🚀 启动指南 (How to Run)
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker compose up --build`
3. 等待容器启动完成...

## 🔗 服务地址 (Services)
- Frontend: http://localhost:3872
- Backend API: http://localhost:8872
- Database: localhost:33872 (user: sdadk / pass: 123456)

## 🧪 测试账号
- 注册即可自动登录
- 默认注册名: UserA
- 默认头像: 随机生成

---

## 📂 项目结构
- `backend/`: Laravel 后端代码
- `frontend/`: React 前端代码
- `docker-compose.yml`: 容器编排文件

## ⚠️ 注意事项
- 项目完全容器化，无需本地安装 PHP 或 Node.js 环境。
- 数据库数据持久化在 Docker Volume `db_data` 中。
- 前端通过 Nginx 反向代理 `/api` 请求到后端，解决 CORS 问题。
