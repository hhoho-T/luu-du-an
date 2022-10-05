// chúng ta thêm bind lại đúng cái mà nó mong chờ 
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// lấy ra thẻ có id heading 

// console.log($('#heading'))

// tạo 1 cái quản lí oto 

// đặt tên là app dùng IFE để đặt và tạo ra 1 cái hàm chạy ngay và có 1 phạm vi độc lập cắt biến kh cho chạy bên ngoài tránh tạo ra cloble tạo ra biến xung đột và biến app là biến duy nhaart để ta dùng còn 2 biến $ là dùng lại nhiều làn là biến cloble

const app = (() => {
    // tạo ra 1 biến là cars lưu tên oto 
    const cars = ['BWM'];
    // get Element từ cái jonh 
    const root = $('#root')
        // áp dụng bài học trả ra 1 Object
    return {
        // trong này chứa nhiều method để có theere thêm ô tô
        add(car) {
            cars.push(car);
        },
        // phuong thức để xóa
        delete(index) {
            cars.splice(index, 1);
        },
        // tạo ra 1 methods để có thể redeer ra view 
        render() {
            // khi xóa 1 phần tử của mảng ta cần phải có index 
            const html = cars.map((car, index) =>
                    // return ra 1 thẻ li 
                    // thêm 1 thẻ xóa và đưa index vào data-index (data- là cách tạo ra 1 cái dataset)
                    `<li>
                    ${car}
                    <span class="delete" data-index="${index}">&times</span>
                    </li>`
                )
                // bởi vì map trả ra 1 mảng nên chúng ta sẽ jonh nó ra 
                .join('')
                // từ cái chuỗi này sẽ get ra cái element root 
            root.innerHTML = html
        },
        // tạo 1 handledelete để sử lý xóa 
        handledelete(e) {
            // closest là dùng để kiểm tra xem có thể delete trong đó kh 
            const deleteBtn = e.target.closest('.delete')
            if (deleteBtn) {
                const index = deleteBtn.dataset.index
                this.delete(index)
                this.render()
            }
        },
        init() {
            // thêm tên xe 
            const that = this

            submit.onclick = () => {
                const car = input.value

                that.add(car)
                that.render()

                // dùng chuỗi rỗng null để xóa nó đi 
                input.value = null
                    // dùng foucs để nó chọc vào 
                input.focus()
            }

            // gọi this.handledelete với mong muốn là khi click vao id root nó sẽ vào hàm this.handledelete
            root.onclick = this.handledelete.bind(this)
            this.render()
        }
    }
})();
app.init()

// sử dụng Delegeta