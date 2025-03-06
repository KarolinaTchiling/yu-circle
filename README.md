


# To Run on Local Machine:

```
git clone https://github.com/KarolinaTchiling/yu-circle.git
```
## Frontend: React + TypeScript + Vite + TailwindCSS v.4


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

## Backend: Spring Boot + Postgres

<details>
### ProfileService:
Assuming you are using eclipse, follow these steps:

1. Open eclipse, and go to the top menu to select Help > Eclipse Marketplace.

2. Search for 'Spring Boot'.

3. Install Spring Tools 4.28.

4. Restart eclipse and import the project into your workspace.

5. Open the Azure website, find the yucircle database, and start it.

6. Back in eclipse, right click on the project folder and select Run As > Spring Boot App.


Example commands:
```
curl -X GET "http://localhost:8080/profiles/jdoe"

curl -X GET "http://localhost:8080/profiles"
```

Authentication:
```
curl -X POST http://localhost:8080/profiles/login \
     -H "Content-Type: application/json" \
     -d '{"username": "bob", "password": "password"}'
```

</details>
<details>
### DiscourseService:
To run, follow the same steps as outlined in the ProfileService.

#### Posts:
##### Get all posts:
```
curl -X GET http://localhost:8080/posts
```

##### Get one post:
The postId is in the URL (in this example it is '/1').
```
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
The postId is in the URL (in this example it is the '/1')
```
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
The commentId is in the URL (in this example it is '/1').
```
curl -X GET http://localhost:8080/comments/1
```

##### Get comments by post:
The postId is in the URL (in this example it is '/1').
```
curl -X GET http://localhost:8080/comments/posts/1
```

##### Add a comment:
The postId is in the URL, that is the post that the comment is attached to (In this example it is '/1').
```
curl -X POST http://localhost:8080/comments\
     -H "Content-Type: application/json" \
     -d '{
           "content": "CS is so fun",
           "username": "bob",
           "title": "wow"
         }'
```

##### Delete a comment:
The commentId is in the URL (in this example it is the '/1')
```
curl -X DELETE http://localhost:8080/comments/delete/1 \
```

##### Update a comment:
The commentId is in the URL (in this example it is the '/1')
```
curl -X PUT http://localhost:8080/comments/update/1 \
     -H "Content-Type: application/json" \
     -d '{
           "content": "updated text.",
         }'
```
</details>