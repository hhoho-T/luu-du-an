// hàm Vatirico nó cũng thuộc Object  
// đối tượng 
function Vatirico(options) {

    // tạo thêm 1 hàm để khi có nhiều lớp bên ngoài ta vẫn lấy được các thẻ bên trong ra element là input còn select là class full-group 
    function getParent(element, selectpr) {
        // dùng vòng lặp để kiểm tra cho đến cuối và cho đến khi chạm vào thẻ bên trong 
        while (element.parentElement) {
            // element luôn luôn là thẻ con còn parentElemen  là thẻ cha bên ngoài  và vì thế nó sẽ chạy vộ hạn cho đến phần tử cuối 
            // matches sẽ kiểm tra xem element này có mes với selectpr hay không
            // nếu element.parentElement.matches(selectpr) nó không đúng thì nó sẽ kh return và vòng lặp sẽ tiếp tục 
            if (element.parentElement.matches(selectpr)) {
                return element.parentElement
            }
            // CÁCH HOẠT ĐỘNG BAN ĐẦU element là thẻ input còn sau khi gán element thì nó là thẻ div và element quay lại vòng lặp ban đầu thì nó là thẻ div sau đó nó tìm xem div có mes với full all
            // trường hợp ngoại lệ nếu ta tìm không thấy thì ta sẽ gán biến element bằng chính thẻ cha của thẻ input luôn 
            element = element.parentElement
        }
    }

    // sau khi hàm này chạy xong nó sẽ lưu tất cả những cái rule của tất cả những thẻ select 
    var selectorRules = {};

    // viết ra cái hàm thực hiện in ra lỗi hoặc bỏ lỗi đi 
    function invalidDate(inputElement, rule) {
        // đoạn kiểm tra lỗi nếu có sẽ in ra chữ và màu đỏ
        var formFOR = getParent(inputElement, options.formGroupSelect);
        var errorElement = formFOR.querySelector('.form-messger')
        var errorMessage;

        // lấy ra các rules của select
        //  RULES NÀY LÀ 1 MẢNG 
        var rules = selectorRules[rule.select]
            // dùng for lặp lại để mỗi lần lặp qua lấy đc 1 cái rules để check  
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.select + ':checked')
                    )
                    break;
                default:
                    // do đã khai báo ở đây nên chỉ cần khai báo errorMessage ở đây bên trên xóa
                    errorMessage = rules[i](inputElement.value)

            }
            // nếu có lỗi thì thoát khỏi vòng lặp   
            if (errorMessage)
                break;
        }
        console.log(rules)

        if (errorMessage) {
            // từ thẻ con lấy ra thẻ cha sau  đó lấu thẻ con bên trong
            errorElement.innerText = errorMessage;
            formFOR.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            formFOR.classList.remove('invalid');
        }
        // hàm invalidDate sẽ trả ra là true nếu có lỗi nếu có lỗi sẽ là false 
        return !errorMessage;
    }

    // lấy Element của form cần invalidDate 
    var formElement = document.querySelector(options.form)
    if (formElement) {
        // bỏ đi sự kiện reload lại trang 
        formElement.onsubmit = function(e) {
                e.preventDefault();

                // tạo 1 biến khi không có lỗi
                var isFormVaild = true;
                // thực hiện lặp qua từng rules và in ra invalidDate
                options.rules.forEach(function(rule) {
                    var inputElement = formElement.querySelector(rule.select)
                    var isVaild = invalidDate(inputElement, rule);
                    if (!isVaild) {
                        isFormVaild = false;
                    }
                });
                // để lấy ra tất cả các thẻ input ở trạng thái eniblaInput và select tất cả các thẻ có atribile là name và các thẻ không có atribile là disable
                if (isFormVaild) {
                    if (typeof options.onSubmit === 'function') {
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
                        // làm nhưu này sẽ là sau sẽ cho API vào 
                        options.onSubmit(formvalues)
                    }
                    // trường hợp submit với hành vị mặc định
                    else {
                        formElement.submit();
                    }
                }
            }
            // lặp qua mỗi rules và xử lý (lắng nghe sự kiện như blur, input ...)
        options.rules.forEach(function(rule) {
            // khi chưa gán selectorRules[rule.select] = rule.test; thì nó sẽ trả về là undefine vì thế sẽ kiểm tra khi nó là undefine thì nó sẽ là Array còn kh phải undefine thì kh phải là Array
            if (Array.isArray(selectorRules[rule.select])) {
                selectorRules[rule.select].push(rule.test);
            } else {
                // lần đầu tiên chạy nó sẽ lọt vào đây nếu chạy lần tiếp theo thì nó sẽ lọt lên bên trên 
                selectorRules[rule.select] = [rule.test];
            }
            // lưu lại tất cả rule cho thẻ input 
            // viết lại object vừa tạo bên trên dùng ngoặc vuông để làm KI của object và lưu rule.select vào = rule.select .test
            var inputElements = formElement.querySelectorAll(rule.select)
                // sau khi đã có thẻ inputElement thì ta đi kiểm tra nó

            // chuyển inputElement qua phương thức Array để lặp lại
            Array.from(inputElements).forEach(function(inputElement) {

                // xử lí trường hợp blur ra khỏi input 
                // lắng nghe sự kiện di chuột ra bên ngoài 
                inputElement.onblur = function() {
                        invalidDate(inputElement, rule)
                    }
                    // xử lý trường hợp khi nhập sẽ xóa cảnh báo 
                    // oninput là event sẽ lặp lên nếu người dùng người ta gõ
                inputElement.oninput = function() {
                    // khi người dùng bắt đầu gõ là xóa class đó đi 
                    var errorElement = inputElement.parentElement.querySelector('.form-messger')
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            })
        });
        // console.log(selectorRules)
    }
}
// định nghĩa các rules có nghĩa là các điều luật phải bắt buộc phải định nghĩa theo
// nguyên tắc của rules
/**
 * 
 * khi có lỗi thì tra ra  messenger lỗi 
 * khi hợp lệ thì không tra ra cái gì cả (undifined)
 */
Vatirico.isRequired = function(select) {
    // return về bên Object
    return {
        select: select,
        // trả thêm function để kiểm tra như nào bắt buộc phải nhập hoặc không nhập 
        test: ((value) => {
            // gọi phương thức trim để loại bỏ những khoảng cách
            return value ? undefined : 'Vui lòng nhập nhập đúng trường hợp này '
        })
    };
}
Vatirico.isEmail = function(select) {
        return {
            // kiểm tra xem nó có phải email hay không 
            select: select,
            test: ((value) => {
                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                return regex.test(value) ? undefined : 'vui lòng nhập email và đúng kí tự'
            })
        }
    }
    // min dùng để độ dài tối thiểu chúng ta mong muốn là gì
Vatirico.minLe = function(select, min) {
        return {
            // kiểm tra xem nó có phải email hay không 
            select: select,
            test: ((value) => {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự `;
            })
        }
    }
    // xử lý trường hợp mật khẩu nhập lại không giống nha
Vatirico.same = function(select, forValue) {
    return {
        // kiểm tra xem nó có phải email hay không 
        select: select,
        test: ((value) => {
            return value === forValue() ? undefined : 'Vui lòng nhập đúng mật khẩu vừa nhập';
        })
    }
}