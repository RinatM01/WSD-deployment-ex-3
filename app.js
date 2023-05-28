import { serve } from './deps.js';
import { configure, renderFile } from './deps.js';
import * as chatService from './services/chatServices.js';

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { 'Content-Type': 'text/html;charset=UTF-8' },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}`, {
    status: 303,
    headers: {
      Location: path,
    },
  });
};

const addMsg = async (request) => {
  const formData = await request.formData();
  const dits = {
    sender: formData.get('sender'),
    msg: formData.get('message'),
  };
  await chatService.create(dits);
};

const deleteName = async (request) => {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const id = parts[2];
  await songService.deleteById(id);
  return redirectTo('/songs');
};

const listLastFive = async (req) => {
  const data = {
    msgs: await chatService.findLastFive(),
  };
  return new Response(
    await renderFile('index.eta', data),
    responseDetails
  );
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  const isRightPath = url.pathname === '/';
  if (request.method === 'GET' && isRightPath) {
    return await listLastFive();
  } else if (
    request.method === 'POST' &&
    url.pathname.includes('delete')
  ) {
    return await deleteName(request);
  } else if (request.method === 'POST' && isRightPath) {
    await addMsg(request);
    return redirectTo(url.pathname);
  } else {
    return redirectTo('/');
  }
};

serve(handleRequest, { port: 7777 });
