export const logout = () => {
    localStorage.removeItem('_token');
    localStorage.removeItem('_user');
    window.location.href = window.origin;
}
