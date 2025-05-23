document.addEventListener('DOMContentLoaded', async () => {

    const regModal = document.querySelector("#register");
    const logModal = document.querySelector("#login");
    const logBtns = document.querySelectorAll('.log');
    const regBtns = document.querySelectorAll('.reg');

    function showRegModal() {
        regModal.classList.add('active');
        document.body.style.overflowY = 'hidden';
    }

    function closeRegModal() {
        regModal.classList.remove('active');
        document.body.style.overflowY = '';
    }

    function showLogModal() {
        logModal.classList.add('active');
        document.body.style.overflowY = 'hidden';
    }

    function closeLogModal() {
        logModal.classList.remove('active');
        document.body.style.overflowY = '';
    }

    logBtns.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showLogModal()
        });
    });
    regBtns.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showRegModal()
        });
    });
    regModal.addEventListener('click', (e) => {
        const wrap = document.querySelector('.modal__wrapper');
        if (e.target != wrap) {
            closeRegModal();
        }
    });
    logModal.addEventListener('click', (e) => {
        const wrap = document.querySelector('.modal__wrapper');
        if (e.target != wrap) {
            closeLogModal();
        }
    });



    async function resetCards(wrapperSelector) {
        const wrapper = document.querySelector(wrapperSelector);
        const response = await fetch('http://localhost:3000/posts');
        const data = await response.json();
        if (data) {
            data.forEach(item => {
                wrapper.innerHTML += `
                    <div class="joined__card">
                        <img src="img/user.png" alt="User">
                        <div class="joined__card-content">
                            <div class="joined__card-name">${item.user}</div>
                            <div class="joined__card-email">${item.email}</div>
                        </div>
                    </div>
                `;
            });
        }
    }

    resetCards('.joined__people');
});