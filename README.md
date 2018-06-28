# Group Points
A web application that helps to boost community engagement in Facebook groups with gamification, by rewarding members with points for contributing.

# Requirements
- Firebase auth
- Firebase database
- axios
- bulma
- moment
- react-copy-to-clipboard
- react-lines-ellipsis
- react-router-dom
- react-spinners
- react-toastify
- fontawesome.

this is the firebase database structure :

```json

{
  "groups" : {
    "group-id" : {
      "createdAt" : timestamp,
      "members" : {
        "member-id" : {
          "admin" : true
        },
        "member-id" : {
          "admin" : false,
          "points" : 0
        },
  },
  "members" : {
    "member-id" : {
      "email" : "example@gmail.com",
      "groups" : {
        "group-id" : {
          "admin" : true
        },
        "group-id" : {
          "admin" : false,
          "points" : 0
        }
      },
      "photo" : "https://graph.facebook.com/xxxxxxxxxxx/picture",
      "username" : "FIRST LAST"
    },
  },
  "posts" : {
    "group-id" : {
      "member-id" : {
        "post-id" : {
          "createdAt" : timestamp,
          "link" : "https://www.facebook.com/groups/xxxxxxxx/permalink/xxxxxxxxxx/",
          "points" : 0
        }
      },
    }
  }
}


```

