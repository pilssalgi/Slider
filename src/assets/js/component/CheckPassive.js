module.exports = function(){
  if (typeof window === 'object' && typeof window.addEventListener === 'function' && Object.defineProperty) {
    let passive = false;
    const options = Object.defineProperty({}, 'passive', {
      get() { passive = true; }
    });
    window.addEventListener('test', null, options);
    return passive;
  }
}