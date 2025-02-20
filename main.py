from fastapi import FastAPI
import uvicorn
from routers.categories import crouter
from routers.ingredients import irouter
from routers.areas import arouter
from routers.meals import mrouter

# Initialize FastAPI app
app = FastAPI(
    title="Nutrition API",
    description="An API to fetch meal information, ingredients, areas, and categories.",
    version="1.0.0"
)

# Include routers for different API sections
app.include_router(irouter)
app.include_router(arouter)
app.include_router(mrouter)
app.include_router(crouter)

# Root endpoint
@app.get("/", summary="Welcome page", include_in_schema=False)
async def root():
    """Returns a welcome message for the API."""
    return {"message": "Hello, Welcome to My Nutrition API. This is the starting page."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)





