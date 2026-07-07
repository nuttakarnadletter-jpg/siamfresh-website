#!/bin/zsh

cd "$(dirname "$0")" || exit 1

PORT=5174
URL="http://127.0.0.1:${PORT}/revise-v2.html"
LOG_FILE="/tmp/revise-v2-preview.log"

echo "Opening Siam Fresh preview..."
echo ""

if lsof -nP -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "A preview server is already running on port ${PORT}."
  open "${URL}"
  echo "Opened: ${URL}"
  echo ""
  echo "You can close this window."
  exit 0
fi

python3 -m http.server "${PORT}" --bind 127.0.0.1 >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!

sleep 1

if ! lsof -nP -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Could not start the preview server."
  echo "Log: ${LOG_FILE}"
  echo ""
  echo "Press any key to close this window."
  read -k 1
  exit 1
fi

open "${URL}"

echo "Preview is open:"
echo "${URL}"
echo ""
echo "Keep this window open while previewing."
echo "Press Ctrl+C here when you want to stop the preview server."

wait "${SERVER_PID}"
