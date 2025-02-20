from fastapi import APIRouter
from internal.NutritionApi import MealdbApi

arouter = APIRouter(prefix="/areas",
                    tags=["areas"])


nutrition = MealdbApi()

@arouter.get("/", summary = "areas")
async def get_areas():
    return nutrition.all_areas()


@arouter.get("/{area}", summary="area")
async def get_area(area: str):
    return nutrition.search_by_area(area)