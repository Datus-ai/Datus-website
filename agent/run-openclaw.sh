#!/usr/bin/env bash
# Start the OpenClaw Gateway (manual mode, background) and open the Dashboard.
# Stop: kill $(cat /tmp/openclaw-gateway.pid)  or  pkill -f "openclaw gateway run"
set -uo pipefail

PORT=18789
URL="http://127.0.0.1:${PORT}/"
LOG="/tmp/openclaw-gateway.log"
PIDFILE="/tmp/openclaw-gateway.pid"

command -v openclaw >/dev/null 2>&1 || {
  echo "✗ 'openclaw' command not found. Run this in a terminal that has openclaw installed (with nvm, source your shell profile first)."
  exit 1
}

# Liveness probe: any curl response (incl. 401/200) means it's up; connection refused means it's not.
is_up() { curl -s -o /dev/null --max-time 2 "$URL"; }

if is_up; then
  echo "✓ Gateway already running (:$PORT)"
else
  echo "▶ Starting OpenClaw Gateway (background, manual mode)…"
  nohup openclaw gateway run > "$LOG" 2>&1 &
  echo $! > "$PIDFILE"
  echo "  PID $(cat "$PIDFILE") · log $LOG"
  echo -n "  Waiting for it to be ready"
  for i in $(seq 1 30); do
    if is_up; then echo " → ready"; break; fi
    echo -n "."; sleep 1
    [ "$i" -eq 30 ] && { echo " ✗ timeout"; echo "  Check the log: $LOG"; exit 1; }
  done
fi

echo "🌐 Opening the Dashboard (token included automatically)…"
openclaw dashboard

echo ""
echo "Dashboard URL: $URL"
echo "Stop the Gateway: kill \$(cat $PIDFILE) 2>/dev/null  or  pkill -f 'openclaw gateway run'"
