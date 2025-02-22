import requests
import logging

logging.basicConfig(level=logging.WARNING)  # Configure logging

class MealdbApi:
    """Client to interact with TheMealDB API."""

    BASE_URL = "https://www.themealdb.com/api/json/v1/1/"

    def __init__(self):
        self.session = requests.Session()

    def __del__(self):
        """Ensure session is closed when the object is deleted."""
        self.session.close()

    def _get(self, endpoint):
        """Helper method to make GET requests with error handling."""
        try:
            response = self.session.get(f"{self.BASE_URL}{endpoint}")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logging.warning(f"API request failed: {e}")
            return None

    def search_by_ingredient(self, ingredient: str):
        """Search meals by ingredient name."""
        return self._get(f"filter.php?i={ingredient}")

    def search_by_area(self, area: str):
        """Search meals by area/cuisine."""
        return self._get(f"filter.php?a={area}")

    def search_by_category(self, category: str):
        """Search meals by category."""
        return self._get(f"filter.php?c={category}")

    def search_by_meal_id(self, meal_id: int):
        """Get detailed meal information by ID."""
        return self._get(f"lookup.php?i={meal_id}")

    def get_list(self, list_type: str):
        """Generic method to retrieve available categories, areas, or ingredients."""
        valid_types = {"c": "categories", "a": "areas", "i": "ingredients"}
        if list_type in valid_types:
            return self._get(f"list.php?{list_type}=list")
        logging.warning(f"Invalid list type: {list_type}")
        return None

    def all_categories(self):
        """Get all meal categories."""
        return self.get_list("c")

    def all_areas(self):
        """Get all meal areas."""
        return self.get_list("a")

    def all_ingredients(self):
        """Get all available ingredients."""
        return self.get_list("i")

    def meal_categories(self):
        """Get detailed meal categories."""
        return self._get("categories.php")

    def categories_by_id(self, ingredient_id: int):
        """Retrieve ingredient details by its ID."""
        data = self.all_ingredients()
        if data and "meals" in data:
            return next((ingredient for ingredient in data["meals"] if ingredient["idIngredient"] == str(ingredient_id)), None)
        return None

