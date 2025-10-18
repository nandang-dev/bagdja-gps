# Bagdja GPS Tracker - API Documentation

## Base URL
```
https://your-project.supabase.co/functions/v1
```

## Authentication
API menggunakan custom header authentication:
- `avl` - AVL identifier dari device
- `api-key` - API key yang digenerate saat create device

## Endpoints

### POST /gps-receiver

Menerima data GPS dari device dan menyimpannya ke database.

#### Request Headers
```
avl: string (required)
api-key: string (required)
Content-Type: application/json
```

#### Request Body
```json
{
  "lat": number,      // Latitude (-90 to 90)
  "lng": number,      // Longitude (-180 to 180)
  "date_time": number // Unix timestamp in milliseconds
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "GPS data received successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "550e8400-e29b-41d4-a716-446655440001",
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000,
    "created_at": "2025-10-18T10:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid data format
```json
{
  "error": "Invalid GPS data format. Expected: { lat: number, lng: number, date_time: number }"
}
```

**400 Bad Request** - Invalid coordinate range
```json
{
  "error": "Latitude must be between -90 and 90"
}
```
```json
{
  "error": "Longitude must be between -180 and 180"
}
```

**401 Unauthorized** - Missing headers
```json
{
  "error": "Missing authentication headers (avl or api-key)"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "error": "Invalid authentication credentials"
}
```

**403 Forbidden** - Device inactive
```json
{
  "error": "Device is inactive"
}
```

**405 Method Not Allowed**
```json
{
  "error": "Method not allowed"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to save GPS data"
}
```

## Examples

### cURL
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/gps-receiver \
  -H "avl: YOUR_AVL" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": -6.200000,
    "lng": 106.816666,
    "date_time": 1697644800000
  }'
```

### JavaScript/TypeScript
```javascript
const sendGpsData = async (avl, apiKey, lat, lng) => {
  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/gps-receiver',
    {
      method: 'POST',
      headers: {
        'avl': avl,
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
        date_time: Date.now(),
      }),
    }
  );

  const data = await response.json();
  return data;
};

// Usage
sendGpsData('your-avl', 'your-api-key', -6.200000, 106.816666)
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Python
```python
import requests
import time

def send_gps_data(avl, api_key, lat, lng):
    url = 'https://your-project.supabase.co/functions/v1/gps-receiver'
    headers = {
        'avl': avl,
        'api-key': api_key,
        'Content-Type': 'application/json'
    }
    data = {
        'lat': lat,
        'lng': lng,
        'date_time': int(time.time() * 1000)
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = send_gps_data('your-avl', 'your-api-key', -6.200000, 106.816666)
print(result)
```

### Arduino/ESP32
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "https://your-project.supabase.co/functions/v1/gps-receiver";
const char* avl = "your-avl";
const char* apiKey = "your-api-key";

void sendGpsData(float lat, float lng) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("avl", avl);
    http.addHeader("api-key", apiKey);
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["lat"] = lat;
    doc["lng"] = lng;
    doc["date_time"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void loop() {
  float lat = -6.200000;  // Get from GPS module
  float lng = 106.816666; // Get from GPS module
  
  sendGpsData(lat, lng);
  delay(60000); // Send every 60 seconds
}
```

## Data Validation

### Latitude
- Type: Number (Decimal)
- Range: -90 to 90
- Precision: Up to 8 decimal places

### Longitude
- Type: Number (Decimal)
- Range: -180 to 180
- Precision: Up to 8 decimal places

### Date Time
- Type: Number (Integer)
- Format: Unix timestamp in milliseconds
- Example: 1697644800000 (October 18, 2023 10:00:00 GMT)

## Rate Limiting

Tidak ada rate limiting di API level, namun Supabase memiliki limits berdasarkan plan:
- Free plan: 500MB database, 2GB bandwidth
- Pro plan: 8GB database, 50GB bandwidth

## Best Practices

1. **Retry Logic**: Implement exponential backoff untuk retry saat error
2. **Batch Upload**: Jika device offline, simpan data lokal dan upload batch saat online
3. **Timestamp**: Gunakan device time untuk date_time, bukan server time
4. **Error Handling**: Handle semua error responses dengan proper
5. **Security**: Jangan hardcode credentials di code, gunakan secure storage
6. **Validation**: Validate GPS coordinates sebelum send ke API

## Monitoring

Check logs di Supabase Dashboard:
1. Navigate to "Edge Functions"
2. Select "gps-receiver"
3. Click "Logs" tab
4. Filter by status code, timestamp, etc.

## Support

Untuk pertanyaan atau issues, silakan contact developer.

