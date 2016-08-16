export function test() {
  return fetch('/api/v1')
  .then(function(response) {
    return response.json()
  }).then(onDone).catch(onFail)
}

const wait = (delay) => new Promise( resolve => setTimeou(resolve, delay) )
