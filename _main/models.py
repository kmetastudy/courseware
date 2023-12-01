from functools import cached_property
from django.db import models
from django.core.validators import MinValueValidator
import uuid
import logging
from decouple import config
from django.http import Http404
from django.urls import reverse
from iamport import Iamport
from _cm.models import courseDetail

from _user.models import mUser

logger = logging.getLogger(__name__)

# Create your models here.
class Payment(models.Model):
    class StatusChoices(models.TextChoices):
        READY = "ready", "미결제"
        PAID = "paid", "결제완료"
        CANCELLED = "cancelled", "결제취소"
        FAILED = "failed", "결제실패"

    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    amount = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1, message="1원 이상의 금액을 지정해주세요."),
        ]
    )
    # ready, paid, cancelled, failed
    status = models.CharField(max_length=9, default=StatusChoices.READY, choices=StatusChoices.choices, db_index=True)
    is_paid_ok = models.BooleanField(default=False, db_index=True)

    @property
    def merchant_uid(self) -> str:
        return self.uid.hex
    
    # 포트원 REST_API를 통해서 결제 검증해야함
    def portone_check(self, commit=True):
        api = Iamport(imp_key=config("PORTONE_API_KEY"), imp_secret=config("PORTONE_API_SECRET"))

        try:
            meta = api.find(merchant_uid=self.merchant_uid)

        except (Iamport.ResponseError, Iamport.HttpError) as e:
            logger.error(str(e), exc_info=e)
            raise Http404(str(e))
        self.status = meta['status']
        self.is_paid_ok = meta['status'] == "paid" and meta['amount'] == self.amount
        
        # TODO: meta 속성을 JSONField 저장
        if commit:
            self.save()

class CartCourse(models.Model):
    user = models.TextField(editable=False, null=True, blank=True)
    course = models.ForeignKey(
        courseDetail,
        on_delete=models.CASCADE,
        db_constraint=False,
    )
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

    def __str__(self):
        return f"<{self.pk}> {self.course} - {self.quantity}"
    
    @property
    def amount(self):
        return self.course.price * self.quantity
    
class Order(models.Model):
    class Status(models.TextChoices):
        REQUESTED = "requested", "주문요청"
        FAILED_PAYMENT = "failed_payment", "결제실패"
        PAID = "paid", "결제완료"
        CANCELED = "canceled", "주문취소"

    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    user = models.TextField(editable=False, null=True, blank=True)
    total_amount = models.PositiveIntegerField("결제금액")
    status = models.CharField("진행상태", max_length=20, choices=Status.choices, default=Status.REQUESTED, db_index=True)
    product_set = models.ManyToManyField(courseDetail, through="OrderedProduct", blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_absolute_url(self) -> str:
        return reverse("_main:order_detail", args=[self.pk])

    def can_pay(self) -> bool:
        return self.status in (self.Status.REQUESTED, self.Status.FAILED_PAYMENT)

    @property
    def name(self):
        first_product = self.product_set.first()
        if first_product is None:
            return "등록된 상품이 없습니다."
        size = self.product_set.all().count()
        if size < 2:
            return first_product.courseTitle
        return f"{first_product.courseTitle} 외 {size - 1 }건"

    @classmethod
    def create_from_cart(cls, user, cart_product_qs) -> "Order":
        cart_product_list = list(cart_product_qs)
        total_amount = sum(cart_product.amount for cart_product in cart_product_list)
        order = cls.objects.create(user=user, total_amount=total_amount)

        ordered_product_list = []
        for cart_product in cart_product_list:
            product = cart_product.course
            ordered_product = OrderedProduct(
                order=order,
                product=product,
                name=product.courseTitle,
                price=product.price,
                quantity=cart_product.quantity
            )
            ordered_product_list.append(ordered_product)

        OrderedProduct.objects.bulk_create(ordered_product_list)

        return order
    
    class Meta:
        ordering = ["-pk"]

class OrderedProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_constraint=False)
    product = models.ForeignKey(courseDetail, on_delete=models.CASCADE, db_constraint=False)
    name = models.CharField("상품명", max_length=100, help_text="주문 시점의 상품명을 저장합니다.")
    price = models.PositiveIntegerField("상품가격", help_text="주문 시점의 상품가격을 저장합니다.")
    quantity = models.PositiveIntegerField("수량")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class AbstractPortonePayment(models.Model):
    class PayMethod(models.TextChoices):
        CARD = "card", "신용카드"

    class PayStatus(models.TextChoices):
        READY = "ready", "결제 준비"
        PAID = "paid", "결제 완료"
        CANCELED = "canceled", "결제 취소"
        FAILED = "failed", "결제 실패"

    meta = models.JSONField("포트원 결제내역", default=dict, editable=False)
    uid = models.UUIDField("쇼핑몰 결제식별자", default=uuid.uuid4, editable=False)
    name = models.CharField("결제명", max_length=200)
    desired_amount = models.PositiveIntegerField("결제금액", editable=False)
    buyer_name = models.CharField("구매자 이름", max_length=100, editable=False)
    buyer_email = models.EmailField("구매자 이메일", editable=False)
    pay_method = models.CharField("결제수단", max_length=20, choices=PayMethod.choices, default=PayMethod.CARD)
    pay_status = models.CharField("결제상태", max_length=20, choices=PayStatus.choices, default=PayStatus.READY)
    is_paid_ok = models.BooleanField("결제성공 여부", default=False, db_index=True, editable=False)

    @property
    def merchant_uid(self) -> str:
        return str(self.uid)

    @cached_property
    def api(self):
        return Iamport(imp_key=config("PORTONE_API_KEY"), imp_secret=config("PORTONE_API_SECRET")) 

    def update(self):
        try:
            self.meta = self.api.find(merchant_uid=self.merchant_uid)
        except (Iamport.ResponseError, Iamport.HttpError) as e:
            logger.error(str(e), exc_info=e)
            raise Http404("포트원에서 결제내역을 찾을 수 없습니다.")
        
        self.pay_status = self.meta["status"]
        self.is_paid_ok = self.api.is_paid(self.desired_amount, response=self.meta)

        # TODO:결제는 되었는 데, 결제금액이 맞지 않는 경우 -> 의심된다거나 플래그를 지정한다

        self.save()

    class Meta:
        abstract = True

class OrderPayment(AbstractPortonePayment):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_constraint=False)

    def update(self):
        super().update()
        if self.is_paid_ok:
            self.order.status = Order.Status.PAID
            self.order.save()
            # 다수의 결제시도 삭제
            self.order.orderpayment_set.exclude(pk=self.pk).delete()

        elif self.pay_status in (self.PayStatus.CANCELED, self.PayStatus.FAILED):
            self.order.status = Order.Status.FAILED_PAYMENT
            self.order.save()

    @classmethod
    def create_by_order(cls, order) -> "OrderPayment":
        return cls.objects.create(
            order=order,
            name=order.name,
            desired_amount=order.total_amount,
            buyer_name=order.user,  # user FK로 연동
            buyer_email=order.user
        )