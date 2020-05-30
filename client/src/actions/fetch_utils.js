export function sendRequest(url, options, timeout = 2 * 60 * 1000, errMsg = 'Request timeout') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(errMsg);
    }, timeout);
    fetch(url, options)
        .then((response) => {
          clearTimeout(timer);
          if(!response.ok) {
            let data;

            try {
              data = response.json();
            } catch (err) {
              reject(response.statusText);
            }

            if(data.err) {
              reject(data.err);
            }else{
              reject(response.statusText);
            }
          }

          return response;
        })
        .then((response) => resolve(response))
        .catch((err) => {
          reject(err);
        });
  });
}


export function handleErrors(response) {
  if(!response.ok) {
    console.log(response.statusText);
    throw Error(response.statusText);
  }

  return response;
}
