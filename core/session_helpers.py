def get_next_url(request, delete=False, default="/"):
    """
    Get next url from session
    """
    next_url = request.session.get("next")

    if next_url:
        if delete == True:
            del request.session['next']
    else:
        next_url = default
    return next_url
