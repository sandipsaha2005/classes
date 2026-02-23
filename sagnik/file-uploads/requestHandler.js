const servePage = async (file) => {
  const page = await Deno.open(`${file}.html`);
  const headers = new Headers();

  headers.append("content-type", "text/html");
  return new Response(page.readable, { headers });
};

const notFound = () =>
  new Response("<h1>Not Found</h1>", {
    status: 404,
    headers: {
      "content-type": "text/html",
    },
  });

const saveFile = async (req) => {
  const formData = await req.formData();
  const file = formData.get("file");
  const fileToSave = await Deno.open(`./uploads/${file.name}`, {
    create: true,
    write: true,
  });

  await file.stream().pipeTo(fileToSave.writable);
  return new Response("Ok", {
    headers: {
      "content-type": "text/html",
    },
  });
};
export const requestHandler = async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return await servePage("index");
  }

  if (url.pathname === "/upload") {
    return saveFile(req);
  }

  return notFound();
};
