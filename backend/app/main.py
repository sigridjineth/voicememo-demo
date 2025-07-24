from fastapi import FastAPI

app = FastAPI(title="Clova Note API", version="0.1.0")


@app.get("/")
async def root():
    return {"message": "Clova Note API"}
