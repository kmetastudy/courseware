## HttpRequest Methods
['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']
### GET
Read

### [POST](https://docs.djangoproject.com/en/4.1/ref/request-response/#django.http.HttpRequest.POST)
Create
POST로 데이터를 전달할 때, form data를 사용하자.
만약, 그게 아닌 데이터의 경우, HttpRequest.body 를 사용하자.
또, file 의 경우 HttpRequest.FILES를 사용하자.

### [Body](https://docs.djangoproject.com/en/4.1/ref/request-response/#django.http.HttpRequest.body)
The raw HTTP request body as a bytestring. 
form 형태가 아닌 데이터를 가공할 때 사용한다. (binary images, CML payload 등)

## [FILES](https://docs.djangoproject.com/en/4.1/ref/request-response/#django.http.HttpRequest.FILES)

How do I post to Django using Axios?
https://stackoverflow.com/questions/49430161/how-do-i-post-to-django-using-axios
json.loads(request.body.decode('utf-8))

Get request body as string in Django
https://stackoverflow.com/questions/29514077/get-request-body-as-string-in-django/29514222#29514222

