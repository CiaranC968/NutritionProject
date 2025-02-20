# 🍽️ FastAPI Nutrition API

A simple FastAPI-based Nutrition API that interacts with [TheMealDB](https://www.themealdb.com/) to retrieve meal information, ingredients, categories, and more.

## 🚀 Features
- Search meals by **ingredient**, **category**, or **area** (cuisine)
- Retrieve **all available ingredients**, **categories**, and **areas**
- Get detailed meal information by **meal ID**
- Uses FastAPI for **fast and efficient** API handling
- Structured with **routers** for modularity


Start the FastAPI server with:
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

## 📚 API Endpoints

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| GET    | `/`                         | Welcome message                 |
| GET    | `/ingredients/`             | List all ingredients            |
| GET    | `/ingredients/{ingredient}` | Search meals by ingredient      |
| GET    | `/ingredients/id/{id}`      | Get ingredient by ID            |
| GET    | `/categories/`              | List all categories             |
| GET    | `/areas/`                   | List all areas (cuisines)       |
| GET    | `/areas/{area}`             | Search meals by area            |
| GET    | `/meals/{meal_id}`          | Get meal details by ID          |
| GET    | `/meals/{category}`         | Search meals by category        |

