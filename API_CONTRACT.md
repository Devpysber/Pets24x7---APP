# PetServices API Contract

This document outlines the API endpoints, request bodies, and response structures for the PetServices application.

## Base URL
`https://ais-dev-dpjemf7ydbslshba3nos62-131130488843.asia-southeast1.run.app/api`

---

## 1. Authentication

### Login
- **Endpoint:** `POST /auth/login`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "avatar": "https://...",
    "phone": "1234567890",
    "vendorProfile": null
  },
  "token": "jwt_token_here"
}
```

### Register
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "USER"
}
```
- **Response (201 Created):** Same as Login response.

### Get Profile
- **Endpoint:** `GET /auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** User object without password.

---

## 2. Listings

### Get Listings (Public)
- **Endpoint:** `GET /listings`
- **Query Parameters:**
  - `category`: string (e.g., "Pet Shops", "Vet Clinics")
  - `city`: string
  - `isPremium`: boolean string ("true"/"false")
  - `search`: string
  - `petType`: string
  - `minRating`: number string
  - `lat`: number string
  - `lng`: number string
  - `sortBy`: string ("rating", "newest", "Most Booked", "nearest")
  - `limit`: number string (default "50")
- **Response (200 OK):**
```json
{
  "listings": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "title": "Happy Paws Grooming",
      "name": "Happy Paws Grooming",
      "category": "GROOMING",
      "rating": 4.8,
      "reviewCount": 120,
      "location": "123 Pet St, City",
      "city": "City",
      "latitude": 12.34,
      "longitude": 56.78,
      "coordinates": { "lat": 12.34, "lng": 56.78 },
      "image": "https://...",
      "gallery": ["https://...", "https://..."],
      "price": "$$$",
      "isPremium": true,
      "phone": "1234567890",
      "whatsapp": "1234567890",
      "description": "Professional grooming services...",
      "vendorName": "Happy Paws Inc.",
      "petTypes": ["Dog", "Cat"],
      "tags": ["Professional", "Affordable"],
      "operatingHours": {
        "monday": { "open": "09:00", "close": "18:00" },
        "sunday": { "open": "00:00", "close": "00:00", "closed": true }
      },
      "distance": 2.5
    }
  ]
}
```

### Get Listing by ID (Public)
- **Endpoint:** `GET /listings/:id`
- **Response (200 OK):** Single listing object (same structure as above).

### Create Listing (Vendor/Admin Only)
- **Endpoint:** `POST /listings`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "vendorId": "uuid",
  "name": "New Service",
  "category": "PET_SHOP",
  "petTypes": ["Dog"],
  "location": "Address",
  "city": "City",
  "latitude": 12.34,
  "longitude": 56.78,
  "isPremium": false,
  "image": "https://...",
  "gallery": ["https://..."],
  "tags": ["New"],
  "price": "$$",
  "description": "Description here",
  "operatingHours": { ... }
}
```

---

## 3. Community

### Get Posts (Public)
- **Endpoint:** `GET /community`
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "userName": "John Doe",
    "userImage": "https://...",
    "category": "Tips",
    "content": "How to train your dog...",
    "image": "https://...",
    "likes": ["user_id_1", "user_id_2"],
    "comments": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "Jane Smith",
        "userImage": "https://...",
        "text": "Great tip!",
        "createdAt": "2024-03-28T12:00:00Z"
      }
    ],
    "createdAt": "2024-03-28T10:00:00Z"
  }
]
```

### Create Post (Protected)
- **Endpoint:** `POST /community`
- **Request Body:**
```json
{
  "userId": "uuid",
  "category": "Tips",
  "content": "My new post",
  "image": "https://..."
}
```

### Toggle Like (Protected)
- **Endpoint:** `POST /community/:postId/like`
- **Request Body:**
```json
{
  "userId": "uuid"
}
```
- **Response (200 OK):**
```json
{
  "likes": ["user_id_1", "user_id_2"]
}
```

### Add Comment (Protected)
- **Endpoint:** `POST /community/:postId/comments`
- **Request Body:**
```json
{
  "userId": "uuid",
  "text": "Nice post!"
}
```

---

## 4. Lost & Found

### Get Posts (Public)
- **Endpoint:** `GET /lost-found`
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "type": "lost",
    "petCategory": "Dog",
    "petType": "Golden Retriever",
    "petName": "Buddy",
    "breed": "Purebred",
    "description": "Lost near Central Park...",
    "location": "Central Park",
    "image": "https://...",
    "contactInfo": "1234567890",
    "createdAt": "2024-03-28T12:00:00Z",
    "userName": "John Doe",
    "userImage": "https://..."
  }
]
```

---

## 5. Leads (Vendor Only)

### Create Lead (Protected)
- **Endpoint:** `POST /leads`
- **Request Body:**
```json
{
  "serviceId": "uuid",
  "vendorId": "uuid",
  "userId": "uuid",
  "userName": "John Doe",
  "userPhone": "1234567890",
  "message": "I'm interested in your service",
  "type": "inquiry",
  "serviceType": "Grooming",
  "preferredTime": "Morning"
}
```

### Get Leads by Vendor (Vendor/Admin Only)
- **Endpoint:** `GET /leads/vendor/:vendorId`
- **Response (200 OK):**
```json
{
  "leads": [
    {
      "id": "uuid",
      "serviceId": "uuid",
      "vendorId": "uuid",
      "serviceName": "Happy Paws Grooming",
      "serviceImage": "https://...",
      "userId": "uuid",
      "userName": "John Doe",
      "userPhone": "1234567890",
      "message": "I'm interested in your service",
      "type": "inquiry",
      "status": "new",
      "createdAt": "2024-03-28T12:00:00Z"
    }
  ]
}
```

---

## 6. Notifications (Protected)

### Get Notifications
- **Endpoint:** `GET /notifications`
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "lead",
    "title": "New Lead",
    "message": "You have a new inquiry from John Doe",
    "isRead": false,
    "createdAt": "2024-03-28T12:00:00Z",
    "link": "/vendor/leads",
    "metadata": { "leadId": "uuid" }
  }
]
```

### Mark as Read
- **Endpoint:** `PATCH /notifications/:id/read`
- **Response (200 OK):** `{ "success": true }`

---

## 7. Banners (Public)

### Get Banners
- **Endpoint:** `GET /banners`
- **Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "image": "https://...",
    "link": "/explore?category=Vet Clinics",
    "title": "Best Vets in Town"
  }
]
```
