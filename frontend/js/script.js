document.addEventListener('DOMContentLoaded', async () => {

    const registerModal = document.querySelector('#register');
    const loginModal = document.querySelector("#login");
    const logBtns = document.querySelectorAll('.log');
    const regBtns = document.querySelectorAll('.reg');

    function showRegModal() {
        registerModal.classList.add('active');
        document.body.style.overflowY = 'hidden';
    }

    function closeRegModal() {
        registerModal.classList.remove('active');
        document.body.style.overflowY = '';
    }

    function showLogModal() {
        loginModal.classList.add('active');
        document.body.style.overflowY = 'hidden';
    }

    function closeLogModal() {
        console.log('close');
        loginModal.classList.remove('active');
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


    // бд

    const messages = {
        success: "Thank you, for participating!",
        failure: "Something went wrong..." 
    }
    let message;

    const showResponse = (message, modalWrapper, modalContent) => {
        return new Promise(resolve => {
            const wrong = document.createElement('div');
            wrong.innerHTML = `${message}`;
            wrong.classList.add('.modal__title');

            modalContent.style.display = 'none';
            modalWrapper.appendChild(wrong);
            setTimeout(() => {
                modalContent.style.display = 'flex';
                modalWrapper.removeChild(wrong);
            }, 3000);
        });
    };

    async function resetCards(wrapperSelector) {
        const wrapper = document.querySelector(wrapperSelector);
        const response = await fetch('http://localhost:3000/posts');
        const data = await response.json();
        wrapper.innerHTML = '';
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
    const cardPost = async (obj) => {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });
        const res = await response.json();
        resetCards('.joined__people');
    };
    const userRegister = async (obj) => {
        const response =  await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });
        const data = await response.json();
        return data;
    };
    const userLogin = async (obj) => {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });
        const data = await response.json();
        return data;
    };




    registerModal.addEventListener('click', async (e) => {
        const wrap = document.querySelector('.modal .reg');
        if (!wrap.contains(e.target || !wrap)) {
            closeRegModal();
        } else {
            if (e.target == document.querySelector('.modal #regSubmit')) {
                e.preventDefault();

                const formData = new FormData(registerModal);
                const data = Object.fromEntries(formData.entries());

                const obj = {
                    fullName: data.nameReg,
                    email: data.emailReg,
                    password: data.passwordReg
                };

                const res = await userRegister(obj);
                registerModal.reset();
                if (res.fullName) {
                    const req = {
                        user: res.fullName,
                        email: res.email
                    }
                    cardPost(req);
                    const welcome = document.querySelector('.header__welcome-text');
                    welcome.innerHTML = `Hello, ${res.fullName}!`;
                    message = messages.success;
                    await showResponse(message, document.querySelector('.modal .reg'), document.querySelector('.reg__content'));
                } else {
                    message = messages.failure;
                    await showResponse(message, document.querySelector('.modal .reg'), document.querySelector('.reg__content'));
                }
            }
        }
    });
    loginModal.addEventListener('click', async (e) => {
        const wrap = document.querySelector('.modal .log');
        if (!wrap.contains(e.target)) {
            closeLogModal();
        } else {
            if (e.target == document.querySelector('.modal #logSubmit')) {
                e.preventDefault();

                const formData = new FormData(loginModal);
                const data = Object.fromEntries(formData.entries());

                const obj = {
                    email: data.emailLog,
                    password: data.passwordLog,
                };

                const res = await userLogin(obj);
                loginModal.reset();
                if (res.fullName) {
                    const welcome = document.querySelector('.header__welcome-text');
                    welcome.innerHTML = `Hello, ${res.fullName}!`;
                    message = messages.success;
                    await showResponse(message, document.querySelector('.modal .log'), document.querySelector('.log__content'));
                } else {
                    message = messages.failure;
                    await showResponse(message, document.querySelector('.modal .log'), document.querySelector('.log__content'));
                }
            }
        }
    });
    
    resetCards('.joined__people');
});