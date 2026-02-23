const knownUsers = ["sagnik", "sandip", "sidhu", "samiran"];

const servePage = async (file) => {
  const page = await Deno.open(`${file}.html`);
  const headers = new Headers();

  headers.append("content-type", "text/html");
  return new Response(page.readable, { headers });
};

export const serveLogin = async (req) => {
  const cookie = await parseCookie(req);

  const headers = new Headers();
  if (!knownUsers.includes(cookie.username)) {
    return await servePage("index");
  }

  headers.append("location", `/welcome`);
  return new Response("Ok", {
    status: 303,
    headers,
  });
};

const notFound = () =>
  new Response("<h1>Not Found</h1>", {
    status: 404,
    headers: {
      "content-type": "text/html",
    },
  });

export const login = async (req) => {
  const formData = await req.formData();
  const username = formData.get("username");
  const headers = new Headers();

  if (knownUsers.includes(username)) {
    headers.append("set-cookie", `username=${username}`);
    headers.append("set-cookie", `foo=bar`);
    headers.append("location", `/welcome`);
    return new Response("Ok", {
      status: 303,
      headers,
    });
  }

  headers.append("location", `/`);
  return new Response("Bad Request", {
    status: 303,
    headers,
  });
};

export const logout = async () => {
  const headers = new Headers();
  headers.append("set-cookie", `username=; MAX_AGE=-1`);
  headers.append("location", `/`);
  return new Response("Ok", {
    status: 303,
    headers,
  });
};

const parseCookie = async (req) => {
  const cookie = await req.headers.get("cookie");
  return Object.fromEntries(cookie.split(";").map((c) => c.trim().split("=")));
};

export const serveProfile = async (req) => {
  const cookie = await parseCookie(req);

  const headers = new Headers();
  if (knownUsers.includes(cookie.username)) {
    return await servePage("welcome");
  }

  headers.append("location", `/`);
  return new Response("Ok", {
    status: 303,
    headers,
  });
};

export const requestHandler = async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return await serveLogin(req);
  }

  if (url.pathname === "/login" && req.method === "POST") {
    return await login(req);
  }

  if (url.pathname === "/logout" && req.method === "POST") {
    return await logout();
  }

  if (url.pathname === "/welcome") {
    return await serveProfile(req);
  }
  return notFound();
};
