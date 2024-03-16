class CreateListModelMixin(object):
    def get_serializer(self, *args, **kwargs):
        """ 
        if an array is passed, set serializer to many 
        ref: https://stackoverflow.com/a/40253309/19651191
        """
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(CreateListModelMixin, self).get_serializer(*args, **kwargs)
