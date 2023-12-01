var IMP = window.IMP;
const code = "{{ portone_shop_id }}"
IMP.init(code);
const json_string = document.querySelector("#payment-props").textContent
const props = JSON.parse(json_string)
console.log(props)
IMP.request_pay(props, function (res) {
    location.href = window.PAYMENT_CHECK_URL;
});