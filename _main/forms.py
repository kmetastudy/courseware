from django import forms
from .models import CartCourse, Payment

class PaymentForm(forms.ModelForm):
    class Meta:
        model = Payment
        fields = ["name", "amount"]

class CartCourseForm(forms.ModelForm):
    class Meta:
        model = CartCourse
        fields = ["quantity"]