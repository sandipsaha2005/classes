const saveDetails = async (request) => {
  const formDetails = await request.formData();
  const username = formDetails.get("username");
  const email = formDetails.get("email");
  const password = formDetails.get("password");
  const image = formDetails.get("image");
  console.log({ username, email, password, image });
  const file = await Deno.open(`./uploads/${image.name}`, {
    write: true,
    create: true,
  });
  await image.stream().pipeTo(file.writable);
  return new Response(null, {
    status: 303,
    headers: { "Location": "/home" },
  });
};

const servePage = async (_request, page, status = 200) => {
  const body = await Deno.readTextFile(`./public/html/${page}.html`);
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html" },
  });
};

export const requestHandler = (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  console.log(request.method, pathname);

  switch (pathname) {
    case "/":
      return servePage(request, "index");
    case "/details":
      return saveDetails(request);
    case "/home":
      return servePage(request, "home");
    default:
      return serveFound(request, "not_found", 404);
  }
};
