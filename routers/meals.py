from fastapi import APIRouter
from internal.NutritionApi import MealdbApi

mrouter = APIRouter(prefix="/meals",
                    tags=["meals"])

nutrition = MealdbApi()


@mrouter.get("/")
async def get_meal_categories():
    return nutrition.meal_categories()


@mrouter.get("/{mealid}", summary="Get category")
async def get_meal_categories(mealid: int):
    return nutrition.search_by_meal_id(mealid)

@mrouter.get("/{category}", summary="Meals by category")
async def get_category(category: str):
    return nutrition.search_by_category(category)

