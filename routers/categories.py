from fastapi import APIRouter
from internal.NutritionApi import MealdbApi

crouter = APIRouter(prefix="/categories",
                    tags=["categories"])


nutrition = MealdbApi()


@crouter.get("/", summary="All Categories")
async def get_categories():
    return nutrition.all_categories()

@crouter.get("/{category}", summary="Each Category")
async def get_category(category: str):
    return nutrition.search_by_category(category)




