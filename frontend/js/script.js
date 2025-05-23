document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/posts');
    const data = await response.json();
    console.log(data);
});