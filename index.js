const Router = require('./router')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getContactID(email) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=UTF-8');
  headers.append('Authorization', 'Basic ' +  btoa( MAUTIC_USERNAME + ':' + MAUTIC_PASSWORD));
  let response = await fetch( MAUTIC_DOMAIN+'/api/contacts?search='+email , {
    method: 'GET',
    headers: headers
  });
  let data = await response.json();
  let id = ( (data.contacts.length != 0) ? Object.keys(data.contacts)[0] : 0 ) ;
  return id;
}

async function putContact(request) {
  let data =
  {
    'ghostid': request.uuid,
    'firstname': request.name.substr(0,request.name.indexOf(' ')),
    'lastname': request.name.substr(request.name.indexOf(' ')+1),
    'email': request.email,
    'doNotContact': (request.subscribed===true)?[]:[{"id": 2,"reason": 1,"comments": "","channel": "email","channelId": null}]
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=UTF-8');
  headers.append('Authorization', 'Basic ' +  btoa( MAUTIC_USERNAME + ':' + MAUTIC_PASSWORD));
  let response = await fetch( MAUTIC_DOMAIN+'/api/contacts/new' , {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  return new Response(
    null,
    {
      headers: { 'content-type': 'text/plain; charset=us-ascii' },
      status: 204,
      statusText: 'success'
    }
  );
};

async function patchContact(request,id) {
  let data =
  {
    'ghostid': request.uuid,
    'firstname': request.name.substr(0,request.name.indexOf(' ')),
    'lastname': request.name.substr(request.name.indexOf(' ')+1),
    'email': request.email,
    'doNotContact': (request.subscribed===true)?[]:[{"id": 2,"reason": 1,"comments": "","channel": "email","channelId": null}]
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=UTF-8');
  headers.append('Authorization', 'Basic ' +  btoa( MAUTIC_USERNAME + ':' + MAUTIC_PASSWORD));
  let response = await fetch( MAUTIC_DOMAIN+'/api/contacts/'+String(id)+'/edit' , {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(data)
  });
  return new Response(
    null,
    {
      headers: { 'content-type': 'text/plain; charset=us-ascii' },
      status: 204,
      statusText: 'success'
    }
  );
};


async function postMember(request) {

  let ghost = await request.json();
  let id = await getContactID(ghost.member.current.email);

  if ( id === 0 ) {
    const resp = await putContact(ghost.member.current)
    return resp
  } else {
    const resp = await patchContact(ghost.member.current,id)
    return resp
  }

};

async function handleRequest(request) {

    const r = new Router()
    r.post('/member', request => postMember(request))

    const resp = await r.route(request)
    return resp

}
