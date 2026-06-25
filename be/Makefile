.PHONY: dev seed install clean

dev:
	uv run uvicorn app.main:app --port 8000 --reload

seed:
	uv run python app/database/seed.py

install:
	uv sync

clean:
	rm -rf __pycache__ app/__pycache__ app/*/__pycache__ .pytest_cache .mypy_cache fireflies.db
