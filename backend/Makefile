.PHONY: init format check requirements test run

init:
	export PATH="$$HOME/.local/bin:$$PATH"
	wget -qO- https://astral.sh/uv/install.sh | sh
	uv venv
	. .venv/bin/activate
	uv sync
	uvx pyrefly init

format:
	uvx ruff format .

check:
	uvx ruff check . --fix; \
	uvx ty check .; \
	uvx pyrefly check

requirements:
	uv export -o requirements.txt --without-hashes --without dev
	uv export -o requirements-dev.txt --without-hashes

#run:
#	uv run uvicorn griffths.main:app --reload --host 0.0.0.0 --port 8081
