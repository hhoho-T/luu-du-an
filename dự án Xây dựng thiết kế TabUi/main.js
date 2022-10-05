const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const tabs = $$('.tab-item')
const panes = $$('.tab-pane')

const tabActive = $('.tab-item.active')
const line = $('.tabs .line')

line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";

// dùng forEach để lặp lại
tabs.forEach((tab, index) => {

    const pane = panes[index]

    // lắng nghe sự kiện

    tab.onclick = function() {

        $('.tab-item.active').classList.remove('active')
        $('.tab-pane.active').classList.remove('active')
            //  nếu có class này thì sẽ bị gỡ bỏ

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";
        this.classList.add('active')
        pane.classList.add('active')
    }
});