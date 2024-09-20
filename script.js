var view = document.querySelector('#root');;
console.log(view);

var sidebar = document.createElement('div');
sidebar.id = 'sidebar';
sidebar.classList.add('sidebar');
console.log('sidebar: ', sidebar);

var body_sidebar = document.createElement('div');
body_sidebar.classList.add('body_sidebar');
body_sidebar.appendChild(sidebar);

view.appendChild(body_sidebar);

var header = document.createElement('div');
header.classList.add('header');
header.innerHTML = `
        <div class="expand-icon">&#9776;</div>
        <span>Danh sách lỗi</span>
        <span class="count">11</span>
    `

var seachInput = document.createElement('input');
seachInput.type = 'text';
seachInput.placeholder = "Search...";
seachInput.id = 'search-input'; // Thêm ID cho ô tìm kiếm

sidebar.appendChild(header);
sidebar.appendChild(seachInput);

var data = {
    sections: [{
            title: 'Khách hàng',
            items: [{
                    text: 'Thông tin nhân thân',
                    subItems: ['Họ và tên (có dấu)', 'Hình thức cư trú (tại địa bàn CN)']
                },
                {
                    text: 'Người tham chiếu',
                    subItems: ['MQH với KH vay']
                }
            ]
        },
        {
            title: 'Nghề nghiệp',
            items: [{
                    text: 'Thông tin nghề nghiệp - Khách hàng: [Tên khách hàng] - CIF: [Số CIF]',
                    subItems: ['Hình thức cư trú (tại địa bàn CN)', 'Hình thức nhận lương']
                },
                {
                    text: 'Thời gian làm việc trong ngành nghề',
                    subItems: []
                }
            ]
        },
        {
            title: 'Tài chính',
            items: [{
                    text: 'A - Thu nhập',
                    subItems: ['TNCN001', 'TNCN021']
                },
                {
                    text: 'Quan hệ với TCTD',
                    subItems: []
                },
                {
                    text: 'Dư nợ VND',
                    subItems: []
                }
            ]
        }
    ]
};

function filterMenu() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const items = section.querySelectorAll('.content li');
        let sectionHasVisibleItems = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchValue)) {
                item.style.display = ''; // Hiện item nếu khớp
                sectionHasVisibleItems = true;
            } else {
                item.style.display = 'none'; // Ẩn item nếu không khớp
            }
        });

        // Ẩn section nếu không có item nào hiển thị
        section.style.display = sectionHasVisibleItems ? '' : 'none';
    });
}

function loadMenu() {

    console.log('voooo ne');

    var sidebar = document.querySelector('.sidebar');
    var contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';

    data.sections.forEach(function(section) {
        var sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';

        // Tính số lượng items và sub-items
        let count = 0;

        section.items.forEach(function(item) {
            count += item.subItems.length; // Đếm các sub-items
        });

        const h2 = document.createElement('h2');
        h2.className = 'label_pane';
        h2.innerHTML = `
            <span class="label_pane-icon">🟢</span> ${section.title}
            <span class="label_pane-count">(${count})</span>
            <span class="label_pane-expand">➕</span>
        `;


        var ul = document.createElement('ul');
        ul.className = 'content';

        section.items.forEach(function(item) {
            var li = document.createElement('li');
            li.innerHTML = `
                <div class="content_header">
                    <span>${item.text}</span>
                    <span class="content-count">(${item.subItems.length})</span>
                </div>
            `;

            if (item.subItems.length > 0) {
                var subUl = document.createElement('ul');
                subUl.className = 'sub-content';

                item.subItems.forEach(function(subItem) {
                    var subLi = document.createElement('li');
                    subLi.textContent = subItem;
                    subUl.appendChild(subLi);
                });

                li.appendChild(subUl);
            }

            ul.appendChild(li);
        });

        sectionDiv.appendChild(h2);
        sectionDiv.appendChild(ul);
        contentContainer.appendChild(sectionDiv);
    });

    sidebar.appendChild(contentContainer);
    //    sidebar.insertBefore(contentContainer, sidebar.querySelector('.footer'));


    // label_pane for sidebar expand/collapse
    document.querySelector('.expand-icon').addEventListener('click', function() {
        let sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');

        let body_sidebar = document.querySelector('.body_sidebar');
        body_sidebar.classList.toggle('collapsed');
    });

    // label_pane for content visibility
    document.querySelectorAll('.label_pane').forEach(function(section) {
        console.log('section: ', section)
        section.addEventListener('click', function() {
            let content = this.nextElementSibling;
            let icon = this.querySelector('.label_pane-expand');

            // label_pane hiển thị nội dung
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block"; // Hiện nội dung
                icon.textContent = "➖"; // Thay icon thành dấu trừ
                this.classList.add('active'); // Thêm lớp active cho label_pane (màu xanh ngọc đậm)
                content.classList.add('active'); // Thêm lớp active cho content (nền trắng, chữ đen)
            } else {
                content.style.display = "none"; // Ẩn nội dung
                icon.textContent = "➕"; // Thay icon thành dấu cộng
                this.classList.remove('active'); // Gỡ bỏ lớp active cho label_pane
                content.classList.remove('active'); // Gỡ bỏ lớp active cho content
            }
        });
    });
    document.querySelectorAll('.content > li').forEach(function(item) {
        item.addEventListener('click', function(e) {
            let subContent = this.querySelector('.sub-content');
            if (subContent) {
                e.stopPropagation(); // Ngăn việc click vào li dẫn tới đóng/mở cả phần section
                this.classList.toggle('active'); // Hiện/ẩn nội dung con
            }
        });
    });


    // Gọi hàm filterMenu khi nhập vào ô tìm kiếm
    document.getElementById('search-input').addEventListener('input', filterMenu);
}

// Gọi hàm loadMenu khi trang được load
window.onload = function() {
    loadMenu();
    filterMenu(); // Gọi hàm tìm kiếm để khởi tạo
};