from fastapi import APIRouter
from internal.NutritionApi import MealdbApi

irouter = APIRouter(prefix="/ingredients",
                    tags=["Ingredients"])  # Prefix reduces redundancy

nutrition = MealdbApi()


@irouter.get("/", summary="Get all available ingredients")
async def get_ingredients_list():
    """Fetches the full list of ingredients."""
    return nutrition.all_ingredients()


@irouter.get("/{ingredient}", summary="Search for recipes by ingredient")
async def get_recipes_by_ingredient(ingredient: str):
    """Finds meals that contain a specific ingredient."""
    return nutrition.search_by_ingredient(ingredient)


@irouter.get("/id/{ingredient_id}", summary="Get ingredient details by ID")
async def get_ingredient_by_id(ingredient_id: int):
    """Fetches ingredient details using its ID."""
    return nutrition.categories_by_id(ingredient_id)
