.PHONY: help install-dev lint format typecheck security test test-cov nft-check shellcheck all clean

PY ?= python3
PKG = src/tor_guard

help:
	@echo "Targets:"
	@echo "  install-dev   install package + dev dependencies"
	@echo "  lint          ruff check"
	@echo "  format        black + ruff --fix"
	@echo "  typecheck     mypy (strict)"
	@echo "  security      bandit"
	@echo "  shellcheck    shellcheck scripts"
	@echo "  nft-check     generate and validate the nftables ruleset (nft -c)"
	@echo "  test          run unit tests"
	@echo "  test-cov      run unit tests with coverage"
	@echo "  all           lint + typecheck + security + shellcheck + test"

install-dev:
	$(PY) -m pip install -e ".[dev]"

lint:
	ruff check src tests

format:
	black src tests
	ruff check --fix src tests

typecheck:
	mypy

security:
	bandit -q -r src -c pyproject.toml

shellcheck:
	shellcheck -x scripts/*.sh

nft-check:
	@PYTHONPATH=src $(PY) -c "from tor_guard.firewall.generator import generate_protected, generate_emergency; \
from tor_guard.firewall.models import RulesetParams; from tor_guard.state import Mode; \
open('/tmp/tg-strict.nft','w').write(generate_protected(RulesetParams(mode=Mode.STRICT,tor_uid=107,trans_port=9040,dns_port=5353)).text); \
open('/tmp/tg-emerg.nft','w').write(generate_emergency().text)"
	nft -c -f /tmp/tg-strict.nft && echo "strict ruleset OK"
	nft -c -f /tmp/tg-emerg.nft && echo "emergency ruleset OK"

test:
	PYTHONPATH=src $(PY) -m pytest tests/unit -q

test-cov:
	PYTHONPATH=src $(PY) -m pytest tests/unit --cov=tor_guard --cov-report=term-missing

all: lint typecheck security shellcheck test

clean:
	rm -rf .pytest_cache .mypy_cache .ruff_cache htmlcov .coverage build dist *.egg-info
	find . -type d -name __pycache__ -prune -exec rm -rf {} +
