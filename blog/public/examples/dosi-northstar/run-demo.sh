#!/bin/sh
set -eu
DEMO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec "$DEMO_DIR/.venv/bin/python" "$DEMO_DIR/demo.py" "$@"
