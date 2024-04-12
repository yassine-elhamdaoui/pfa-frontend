export function hasRole(role) {
  const authoritiesString = localStorage.getItem("authorities");
  const authorities = authoritiesString ? JSON.parse(authoritiesString) : [];

  return authorities.some((authority) => authority.authority === role);
}
