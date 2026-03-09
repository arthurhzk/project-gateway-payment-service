#!/bin/bash
# Route testing script for project-gateway-payment-service
# Uses seeded users: admin@betalent.tech, manager@betalent.tech, finance@betalent.tech, user@betalent.tech (all password: password123)

BASE_URL="${1:-http://localhost:52814}"
PASS="password123"

echo "=========================================="
echo "Testing routes at $BASE_URL"
echo "=========================================="

# 1. LOGIN (public)
echo -e "\n[1] POST /login (admin@betalent.tech)"
LOGIN_RESP=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@betalent.tech\",\"password\":\"$PASS\"}")
echo "$LOGIN_RESP" | head -c 200
TOKEN=$(echo "$LOGIN_RESP" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then echo -e "\n✓ Token obtained"; else echo -e "\n✗ Login failed"; fi

# 2. SIGNUP (public)
echo -e "\n[2] POST /signup (new user)"
curl -s -X POST "$BASE_URL/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@test.com","password":"password123","passwordConfirmation":"password123"}' | head -c 200
echo ""

# 3. PURCHASE (public) - needs products from seed (id 1,2,3)
echo -e "\n[3] POST /purchase (public)"
PURCHASE_RESP=$(curl -s -X POST "$BASE_URL/purchase" \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Tester","clientEmail":"tester@email.com","cardNumber":"5569000000006063","cvv":"010","products":[{"id":1,"quantity":1}]}')
echo "$PURCHASE_RESP" | head -c 300
if echo "$PURCHASE_RESP" | grep -q "externalId\|external_id"; then echo -e "\n✓ Purchase OK"; else echo -e "\n✗ Purchase may have failed"; fi

# Private routes (need token)
AUTH="Authorization: Bearer $TOKEN"

# 4. LOGOUT
echo -e "\n[4] POST /logout"
curl -s -X POST "$BASE_URL/logout" -H "$AUTH" | head -c 150
echo ""

# Re-login for remaining tests
TOKEN=$(curl -s -X POST "$BASE_URL/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@betalent.tech\",\"password\":\"$PASS\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
AUTH="Authorization: Bearer $TOKEN"

# 5. TRANSACTIONS
echo -e "\n[5] GET /transactions"
curl -s "$BASE_URL/transactions" -H "$AUTH" | head -c 300
echo ""

# 6. TRANSACTION SHOW (use id 1 if exists)
echo -e "\n[6] GET /transactions/1"
curl -s "$BASE_URL/transactions/1" -H "$AUTH" | head -c 200
echo ""

# 7. PRODUCTS (ADMIN/MANAGER/FINANCE)
echo -e "\n[7] GET /products"
curl -s "$BASE_URL/products" -H "$AUTH" | head -c 300
echo ""

# 8. PRODUCTS POST
echo -e "\n[8] POST /products"
curl -s -X POST "$BASE_URL/products" -H "$AUTH" -H "Content-Type: application/json" -d '{"name":"Test Product","amount":999}' | head -c 200
echo ""

# 9. USERS (ADMIN/MANAGER)
echo -e "\n[9] GET /users"
curl -s "$BASE_URL/users" -H "$AUTH" | head -c 300
echo ""

# 10. CLIENTS
echo -e "\n[10] GET /clients"
curl -s "$BASE_URL/clients" -H "$AUTH" | head -c 300
echo ""

# 11. CLIENT SHOW
echo -e "\n[11] GET /clients/1"
curl -s "$BASE_URL/clients/1" -H "$AUTH" | head -c 200
echo ""

# 12. GATEWAYS - toggle (ADMIN only)
echo -e "\n[12] PATCH /gateways/1/toggle"
curl -s -X PATCH "$BASE_URL/gateways/1/toggle" -H "$AUTH" | head -c 150
echo ""

# 13. GATEWAYS - priority (ADMIN only)
echo -e "\n[13] PATCH /gateways/1/priority"
curl -s -X PATCH "$BASE_URL/gateways/1/priority" -H "$AUTH" -H "Content-Type: application/json" -d '{"priority":1}' | head -c 150
echo ""

# 14. REFUND (ADMIN/FINANCE) - need a transaction id
echo -e "\n[14] POST /transactions/1/refund"
curl -s -X POST "$BASE_URL/transactions/1/refund" -H "$AUTH" | head -c 200
echo ""

echo -e "\n=========================================="
echo "Tests completed"
echo "=========================================="
