


# To Run on Local Machine:

```
git clone https://github.com/KarolinaTchiling/yu-circle.git
```
# Frontend: React + TypeScript + Vite + TailwindCSS v.4
<details>

1. Install [bun](https://bun.sh/)

2. Install dependencies

```
cd frontend

bun install
```

3. Run Frontend

```
bun run dev
```

Tailwind Documentation (v.4): https://tailwindcss.com/docs/styling-with-utility-classes
</details>

# Backend: Spring Boot + Postgres

<details>

## MessageService
<details>
Runs the same way as the other services.
Each message contains:
```
sender: String
receiver: String
content: String
timestamp: LocalDateTime
```

     
### Send a Message (You don't need to include a timestamp for sending a message, it's automatically added):

```
  curl -X POST http://localhost:8080/messages/send \
  -H "Content-Type: application/json" \
  -d '{
        "sender": "bob",
        "receiver": "jdoe",
        "content": "Sup"
      }'
```

     
### Get a conversation by two usernames:
```
curl -X GET "http://localhost:8080/messages/get?user1=jdoe&user2=bob"; 
```
Here you can see that in the parameters for the two usernames are located in the link itself as "user1=" and "user2=".
The messages are returned in order from most recent to oldest.


### Delete a message:
```
curl -X DELETE "http://localhost:8080/messages/delete/1"; 
```
Here the "id" of the message is in the url as "1": ".../delete/1".


### Get all messages sent by a user:
```
curl -X GET "http://localhost:8080/messages/sent?sender=jdoe"
```
Here the "sender" parameter is in the url as "?sender=", in this example the sender is jdoe.


### Get all messages received by a user:
```
curl -X GET "http://localhost:8080/messages/received?receiver=jdoe"
```
Here the "receiver" parameter is in the url as "?receiver=", in this example the receiver is jdoe.
</details>



## MarketplaceService
<details>
Runs the same way as the other services.  

Each product contains:
```
productId: Long
productName: Long
username: String
description: String
price: double
downloadUrl: String
program: String
contentType: String
```

### Get all products:
```
curl -X GET http://localhost:8080/marketplace/products
```
     
### Get product by id:
(id is in the url as {id})
```
curl -X GET http://localhost:8080/marketplace/products/{id}
```

### Search by tags:
There are three fields, program, contentType, and priceType. They are passed in the url as parameters, 
any combination of the three works (you do not need to include all if you dont need it). priceType can be either "free" or "paid".
```
curl -X GET http://localhost:8080/marketplace/search?program=Science&priceType=paid
```
```
curl -X GET http://localhost:8080/marketplace/search?priceType=paid
```
```
curl -X GET http://localhost:8080/marketplace/search?program=Science&contentType=Videos
```
```
curl -X GET http://localhost:8080/marketplace/search?program=Science&contentType=Videos&priceType=free
```

### Add a product:
```
curl -X POST http://localhost:8080/marketplace/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": " Test",
    "username": "bob",
    "description": "test",
    "price": 19.99,
    "downloadUrl": "http://google.com/",
    "program": "Science",
    "contentType": "Tutoring"
  }'
```

### Delete a product by id:
(id is in the url as {id})
```
curl -X DELETE http://localhost:8080/marketplace/products/{id}
```
### Update Tags:
Here the parameters are in the url, in the examples "program=Health", and "contentType=Videos" is where you fill in the tags to update.
Note that you can do any combination of the two, so you don't have to update both everytime.
We don't need to update the priceType because we check "free" or "paid" by what the price of the produce is ($0.00=free).
```
curl -X PUT "http://localhost:8080/marketplace/updatetags/1?program=Health"
```
```
curl -X PUT "http://localhost:8080/marketplace/updatetags/1?contentType=Videos"
```
```
curl -X PUT "http://localhost:8080/marketplace/updatetags/1?program=Health&contentType=Videos"
```

### Update a product:
```
curl -X PUT http://localhost:8080/marketplace/update/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "productName": " Test",
    "username": "bob",
    "description": "test",
    "price": 19.99,
    "downloadUrl": "http://google.com/",
    "program": "Science",
    "contentType": "Tutoring"
  }'
```

## Ratings:

### Add a rating:
Rating is an int.
```
curl -X POST http://localhost:8080/marketplace/rating/add \
     -H "Content-Type: application/json" \
     -d '{
          "productId": 3,
          "rating": 1,
          "username": "jdoe"
     }'
```

### Get the average rating of a product:
Here you put the productId in the url, in this example it goes inside {id}.
```
http://localhost:8080/marketplace/rating/{id}
```

### Get all ratings made by a user:
Here you put the username in the url, in this example it goes inside {username}.
```
http://localhost:8080/marketplace/rating/user/{username}
```



</details>

## ProfileService:
<details>
Assuming you are using eclipse, follow these steps:

1. Open eclipse, and go to the top menu to select Help > Eclipse Marketplace.

2. Search for 'Spring Boot'.

3. Install Spring Tools 4.28.

4. Restart eclipse and import the project into your workspace.

5. Open the Azure website, find the yucircle database, and start it.

6. Back in eclipse, right click on the project folder and select Run As > Spring Boot App.


Get all users:
```
curl -X GET "http://localhost:8080/profiles"
```

Get a user (the username is in the url, in this example it is "test"):
```
curl -X GET "http://localhost:8080/profiles/bio/jdoe"
```

Get a user bio (the username is in the url, in this example it is "test"):
```
curl -X GET "http://localhost:8080/profiles/bio/jdoe"
```

Adding a user:
```
curl -X POST "http://localhost:8080/profiles" \
     -H "Content-Type: application/json" \
     -d '{
            "username": "test",
            "password": "dog",
            "york_id": "123444231",
            "firstname": "Test",
            "lastname": "Test",
            "email": "test@gmail.com",
            "phone_number": 1234567890,
            "bio": "Test"
         }'
```

Update a user (the username is in the url, in this example it is "test"):
```
curl -X PUT "http://localhost:8080/profiles/test" \
     -H "Content-Type: application/json" \
     -d '{
            "yorkId": "123444231",
            "firstname": "Test",
            "lastname": "Test",         
            "email": "test@gmail.com",
            "phoneNumber": "1234567890"
         }'
```

Change a password (the username is in the url, in this example it is "test"):
```
curl -X PUT "http://localhost:8080/profiles/changepass/test" \
     -H "Content-Type: application/json" \
     -d '{
            "password": "dog"
         }'
```

Update a bio (the username is in the url, in this example it is "test"):
```
curl -X PUT "http://localhost:8080/profiles/bio/test" \
     -H "Content-Type: application/json" \
     -d '{
            "bio": "new bio."
         }'
```

Delete a user (the username is in the url, in this example it is "test"):
```
curl -X DELETE "http://localhost:8080/profiles/test"
```


Authentication:
```
curl -X POST http://localhost:8080/profiles/login \
     -H "Content-Type: application/json" \
     -d '{"username": "bob", "password": "password"}'
```

</details>

## DiscourseService:
<details>
To run, follow the same steps as outlined in the ProfileService.

### Posts:
##### Get all posts:
```
curl -X GET http://localhost:8080/posts
```

##### Get one post:

```
// The postId is in the URL (in this example it is '/1').
curl -X GET http://localhost:8080/posts/1
```

##### Add a post:
```
curl -X POST http://localhost:8080/posts \
     -H "Content-Type: application/json" \
     -d '{
           "content": "CS is so fun",
           "username": "bob",
           "title": "wow"
         }'
```

##### Delete a post:
```
curl -X DELETE http://localhost:8080/posts \
```

##### Update a post:

```
// The postId is in the URL (in this example it is the '/1').
curl -X PUT http://localhost:8080/posts/1 \
     -H "Content-Type: application/json" \
     -d '{
           "content": "updated text.",
           "title": "New Title"
         }'
```



### Comments:
##### Get all comments:
```
curl -X GET http://localhost:8080/comments
```

##### Get one comment:

```
// The commentId is in the URL (in this example it is '/1').
curl -X GET http://localhost:8080/comments/1
```

##### Get comments by post:

```
// The postId is in the URL (in this example it is '/1').
curl -X GET http://localhost:8080/comments/posts/1
```

##### Add a comment (top level comment):

```
curl -X POST http://localhost:8080/comments\
     -H "Content-Type: application/json" \
     -d '{
           "content": "CS is so fun",
           "username": "bob",
           "postId": 1
         }'
```

##### Add a comment reply (when comment is not a top level comment, in this case the parent commentId is 3):

```
// Make sure to include the parentId, so that this replies to 
// a comment, and not a post.
curl -X POST http://localhost:8080/comments\
     -H "Content-Type: application/json" \
     -d '{
           "content": "CS is so fun",
           "username": "bob",
           "postId": 1,
           "parentId": 3
         }'
```

##### Delete a comment:

```
// The commentId is in the URL (in this example it is the '/1').
curl -X DELETE http://localhost:8080/comments/delete/1 \
```

##### Update a comment:

```
// The commentId is in the URL (in this example it is the '/1').
curl -X PUT http://localhost:8080/comments/update/1 \
     -H "Content-Type: application/json" \
     -d '{
           "content": "updated text.",
         }'
```
</details>
</details>
