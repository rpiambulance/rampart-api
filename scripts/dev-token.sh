#!/usr/bin/env bash
# Mint a dev access token from the local Keycloak (no browser, no /etc/hosts)
# and print it — for curl/Postman against the API.
#
#   TOKEN=$(./scripts/dev-token.sh)                # dev / dev
#   TOKEN=$(./scripts/dev-token.sh alice s3cret)   # any realm user
#   curl -H "Authorization: Bearer $TOKEN" localhost:3001/v1/members/me
set -euo pipefail

USERNAME="${1:-dev}"
PASSWORD="${2:-dev}"
KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
REALM="${KEYCLOAK_REALM:-rampart}"
CLIENT_ID="${KEYCLOAK_CLIENT_ID:-central}"
CLIENT_SECRET="${KEYCLOAK_CLIENT_SECRET:-dev-secret}"

curl -sf -X POST "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" \
  -d "grant_type=password" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "username=$USERNAME" \
  -d "password=$PASSWORD" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])"
