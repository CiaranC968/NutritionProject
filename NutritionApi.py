import requests

class MealDBClient:
    BASE_URL = "https://www.themealdb.com/api/json/v1/1/"

    def __init__(self):
        self.session = requests.Session()

    def _get(self, endpoint):
        """Helper method to handle API requests with error handling."""
        try:
            response = self.session.get(f"{self.BASE_URL}{endpoint}")
            response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)
            return response.json()
        except requests.RequestException as e:
            print(f"API request failed: {e}")
            return None  # Return None instead of crashing

    def search_by_ingredient(self, ingredient):
        return self._get(f"filter.php?i={ingredient}")

    def search_by_area(self, area):
        return self._get(f"filter.php?a={area}")

    def search_by_category(self, category):
        return self._get(f"filter.php?c={category}")

    def all_categories(self):
        return self._get("list.php?c=list")

    def all_areas(self):
        return self._get("list.php?a=list")

    def all_ingredients(self):
        return self._get("list.php?i=list")
