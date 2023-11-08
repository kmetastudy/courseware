## HTTP Status Code

200 OK: Standard response for successful GET, PUT, PATCH requests.
201 Created: The request has been fulfilled and has resulted in one or more new resources being created.
202 Accepted: 요청은 접수하였지만 처리가 완료되지 않았습니다. (비동기 개념)
204 No Content: The server successfully processed the request and is not returning any content.
301 Move Permanently: The resource moved to the another url
303 See Other: 다른 위치로 요청하라
400 Bad Request: The server could not understand the request due to invalid syntax.
401 Unauthorized: Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
403 Forbidden: The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.
404 Not Found: The server can not find the requested resource.
405 Method Not Allowed: The request method is known by the server but has been disabled and cannot be used.
500 Internal Server Error: An error on the server prevented the request from being fulfilled.

## 각 상황별 Status Code

### Success

Create (POST, PUT)

- 201 Created
- Put의 경우, 기존 리소스를 없데이트하는 경우 200 OK 또는 204 No Content

Read(GET)

- 200 OK
- 요청한 리소스가 존재하지 않는 경우, 404 Not Found

Update(PUT, PATCH)

- 업데이트 성공-> 200OK
- 변경된 내용이 없으면 -> 204 No Content?
- PUT으로 생성한 경우 -> 201 Created

Delete

- 삭제 성공 -> 200 OK
- 없는 리소스-> 204 No Content

## Ref

https://sanghaklee.tistory.com/61
