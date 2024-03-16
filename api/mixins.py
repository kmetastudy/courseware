from rest_framework.permissions import IsAuthenticatedOrReadOnly

from ..auth.authenticate import BaseJWTAuthentication, AdministratorAuthentication


class ApiAuthMixin:
    authentication_classes = (BaseJWTAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)


class SuperUserMixin:
    authentication_classes = (AdministratorAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)


class PublicApiMixin:
    authentication_classes = ()
    permission_classes = ()
