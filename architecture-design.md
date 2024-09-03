# Architecture Design

## What does this application do?
Play a vocabulary game to earn currency and collectible items, trade, or buy collectible items.

## Services
### 1. Authentication
#### Routes
- signup
- signin
- signout
- current-user
#### Databases
1. User
    - Schemas
        - id: ObjectId
        - email: string
        - username: string
        - password: string
#### Utils
- password
#### Events
- None

### 2. Game
#### Routes
- start
- play
- end
#### Databases
1. Vocabulary
    - Schemas
        - id: ObjectId
        - vocabulary: string
        - firstAlphabet: string
        - isUsed: boolean
#### Utils
- game
- timer
- reward
#### Events
1. start
2. end

### 3. Inventory
#### Routes
- create-item
- show-item
- update-item
- update-inventory
- assign-item
#### Databases
1. Item
    - Schemas
        - id: ObjectId
        - name: string
        - description: string
        - category: string
        - rarity: string
        - image: {
            url: string,
            altText: string
        }
2. Player
    - Schemas
        - userId: ObjectId
        - username: string
        - inventory: [
            {
                itemId: ObjectId,
                quantity: number
            }
        ]
#### Utils
- None
#### Events
- None

### 4. Offers
#### Routes
- create
- show
- update
- delete
#### Databases
1. Offer
    - Schemas
        - userId: ObjectId
        - status: string
        - expiresAt: date
        - offeredItems: [
            {
                itemId: ObjectId,
                quantity: number
            }
        ]
        - requestItems?: [
            {
                itemdId: ObjectId,
                quantity: number
            }
        ]
        - price?: number
#### Utils
- None
#### Events
- create

### 5. Payments
#### Routes
- create
#### Databases
1. Payment
    - Schemas
        - offerId: ObjectId
        - transactionId: ObjectId
#### Utils
- None
#### Events
- create

### 6. Expiration
#### Routes
- None
#### Databases
- None
#### Utils
- None
#### Events
- game-expire
- offer-expire
