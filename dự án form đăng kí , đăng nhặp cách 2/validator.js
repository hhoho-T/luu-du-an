// LÀM RA ỨNG DỤNG CHÚNG TA CÓ THỂ SỬ DỤNG CHO NHIỀU CÁI FORM
function Validator(formSelector) {
    // tạo ra 1 biến that = this 
    var that = this;
    //biến này nó là object nó sẽ chứa tất cả cái rules form của chúng ta và mong muốn nó đi qua inputs thì nó sẽ xử lý và đẩy giá trị vào bên trong ví dụ  fullname: 'required',  email: 'required|email'
    var formRules = {}
        // Tạo ra 1 function lấy ra thẻ cha xong lấy thẻ con
    function getParent(element, selector) {
        // truyền element hiện tại bạn đang đứng vào
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            // nếu không matches thì gán element về element.parentElement và nó sẽ nhảy từng bước 1 đúng thì return ra element.parentElement không đúng thì nhảy qua thằng khác kiểm tra
            element = element.parentElement;
        }
    }





    // tạo ra 1 object để lưu cái rules của chúng ta
    /**
     * quy ước tạo rule
     * - nếu có lỗi thì return error massage
     * - nếu không có lỗi thì return về undefine
     */
    var validatorRules = {
        required: function(value) {
            // khi ta nhập vào đây kí tự nhập sẽ chuyển về value 
            return value ? undefined : 'vui lòng nhập trường này';
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                // khi ta nhập vào đây kí tự nhập sẽ chuyển về value 
                // regex.test là để kiểm tra
            return regex.test(value) ? undefined : 'vui nhập email';
        },
        // chúng ta muốn truyền số 6 vào min
        min: function(min) {
            // khi ta nhập vào đây kí tự nhập sẽ chuyển về value 
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự `
            }
        },
        max: function(max) {
            // khi ta nhập vào đây kí tự nhập sẽ chuyển về value 
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự `
            }
        }
    }

    //( CÁCH LẤY RA 1 FUNCTION nó sẽ in ra tất cả các chữ có trong function
    // var rulesName = 'required'
    // console.log(validatorRules[rulesName])

    //Lấy ra cái element là tất cả cái thẻ bên trong theo formSelector
    var formElement = document.querySelector(formSelector)
        // và phải kiểm tra formElement nếu mà có thì ta mới xử lý nếu không sẽ trả về null
    if (formElement) {
        // lấy tất cả các thẻ input có name và rules và nó sẽ trả về 3 element dưới dạng DOM và bản thân cái bên dưới là nodeList nên lặp qua nó 
        var inputs = formElement.querySelectorAll('[name][rules]')
        for (var input of inputs) {

            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {
                var ruleAraay;
                var isRulehasValue = rule.includes(':')
                    // tachs đôi chữ min và số 6
                if (isRulehasValue) {
                    ruleAraay = rule.split(':')
                    rule = ruleAraay[0]
                }
                var ruleFunc = validatorRules[rule];
                if (isRulehasValue) {
                    ruleFunc = ruleFunc(ruleAraay[1])
                }
                // nếu nó là Array thì sẽ push thêm input rules vào đó 
                if (Array.isArray(formRules[input.name])) {
                    // lần thứ 2 lọt vào đây nên chúng ta push vào
                    formRules[input.name].push(ruleFunc);

                }
                // nhưng lần đầu tiên nó chạy nó sẽ chạy vào else  vì nó là form trống object trống nên tạo ra 1 cái Array
                else {
                    formRules[input.name] = [ruleFunc]
                }
            }
            // Lắng nghe sự kiện đê validate (blur, change)
            // tạo
            input.onblur = handlValidate;
            input.oninput = handlClearError;
        }
        // hàm thực hiện validate
        function handlValidate(event) {
            // lấy ra cái rules của nó 
            var rules = formRules[event.target.name]
            var errorMessage;


            for (var rule of rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) {
                    break;
                }
            }


            // neeu có lỗi thì hiển thị ra UI của web
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group')
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-mes')
                    if (formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }
            return !errorMessage
        }

        // hàm clear mes lỗi
        function handlClearError(event) {
            var formGroup = getParent(event.target, '.form-group')
                // kiểm tra xemn có class invalid hay không
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
            }
            var formMessage = formGroup.querySelector('.form-mes')
            if (formMessage) {
                formMessage.innerText = '';
            }

        }
    }
    // xử lý hành vi submit form     
    formElement.onsubmit = function(event) {
        // bỏ qua hành vi mặc định của submit
        event.preventDefault();



        // lấy ra tất cả các thẻ input  
        var inputs = formElement.querySelectorAll('[name][rules]')

        // không có lỗi trả về true, có lỗi trả về false
        var isValid = true;
        for (var input of inputs) {
            if (!handlValidate({ target: input })) {
                isValid = false
            }
        }

        this.onSubmit = function() {

            }
            // khi không có lỗi thì submit form là chạy lại làm cho trang web kh hoạt động nữa
        if (isValid) {
            if (typeof that.onSubmit === 'function') {
                // trường hợp submit với javascript 
                var eniblaInput = formElement.querySelectorAll('[name]  ')
                    // eniblaInput chưa phải là Array nên ta phải chuyển thanh Array
                var formvalues = Array.from(eniblaInput).reduce(function(values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = ''
                                return values
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                        case 'file':
                            values[input.name] = input.file
                            break;

                        default:
                            values[input.name] = input.value
                    }
                    // ta viết như này sẽ đảm bảo toán tử được gán và được trả về 
                    return values;
                }, {});

                // gọi lại hàm và trả về giá trị của form
                that.onSubmit(formvalues);
            } else {

                formElement.submit();
            }

        }
    }
}