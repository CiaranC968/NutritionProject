from fastapi import FastAPI
from NutritionApi import MealDBClient


nutrition = MealDBClient()

app = FastAPI()

@app.get("/")
async def root():
    return ("Hello, Welcome to My Nutrition Api")

@app.get("/ingredients/{ingredient}")
async def get_by_ingredient(ingredient: str):
    return nutrition.search_by_ingredient(ingredient)


@app.get("/area/{area}")
async def get_area(area: str):
    return nutrition.search_by_area(area)


@app.get("/categories/{category}")
async def get_category(category: str):
    return nutrition.search_by_category(category)


@app.get("/area/")
async def get_areas():
    return nutrition.all_areas()

@app.get("/categories/")
async def get_categories():
    return nutrition.all_categories()


@app.get("/ingredients/")
async def get_categories():
    return nutrition.all_ingredients()

@app.get("/meals/")
async def get_meal_categories():
    return nutrition.meal_categories()

