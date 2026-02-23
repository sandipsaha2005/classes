export const requestHandler = async (request) => {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return await serveHomePage();
  }

  if (url.pathname === "/greeting") {
    return await serveGreetingPage(url);
  }

  if (url.pathname === "/submit") {
    return await redirectPage(request);
  }

  return await serveHomePage("not_found", 404);
};

const serveHomePage = async () => {
  const page = await Deno.readTextFile(`./public/html/home.html`);
  return new Response(page, {
    headers: {
      "content-type": "text/html",
    },
  });
};

const serveGreetingPage = async (url) => {
  const { name, email } = Object.fromEntries(new URLSearchParams(url.search));

  // const page = await Deno.readTextFile(`./public/html/greeting.html`);
  return new Response(`<h1>Hello ${name}</h1>`, {
    headers: {
      "content-type": "text/html",
    },
  });
};

const redirectPage = async (req) => {
  const data = await req.text();
  const { name, email, gender } = Object.fromEntries(new URLSearchParams(data));

  const page = await Deno.readTextFile(`./public/html/greeting.html`);

  return new Response(page, {
    status: 303,
    headers: {
      "content-type": "text/html",
      location: `/greeting?name=${name}`,
    },
  });
};
