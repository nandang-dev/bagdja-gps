#!/bin/bash

# Simple Test - Ganti dengan credential Anda dari Dashboard!

curl -v -X POST \
  "https://tgwgdbxpubqlsqzqnlfa.supabase.co/functions/v1/gps-receiver" \
  -H "avl: 3ZQ0NE90TBKZ00UK" \
  -H "api-key: HNBZM1ETEK" \
  -H "Content-Type: application/json" \
  -d '{"lat":-6.2,"lng":106.8,"date_time":1697644800000}'

