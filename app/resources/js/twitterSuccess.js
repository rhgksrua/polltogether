var token = $('.token').data('token');
if (token) {
    window.localStorage.setItem('auth-token', token);
    console.log('login complete');
}
