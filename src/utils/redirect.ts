export function getRedirectTarget() {
  const target = new URLSearchParams(window.location.search).get("redirect");
  return target && target.startsWith("/") && !target.startsWith("//")
    ? target
    : "/shop";
}

// Função que redireciona o user para a página em que estava depois de realizar login, ou para a página de shop caso o target não seja valido.