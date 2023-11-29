from django.db import models
from django.core.validators import MinValueValidator
import uuid

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
    
    # TODO: 포트원 REST_API를 통해서 결제 검증해야함

    def check(self):
        