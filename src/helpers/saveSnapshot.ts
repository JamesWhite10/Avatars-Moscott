const convertBase64ToBLob = (url: string): Blob => {
  let byteString = '';
  if (url.split(',')[0].indexOf('base64') >= 0) byteString = window.atob(url.split(',')[1]);
  else byteString = window.unescape(url.split(',')[1]);

  const mimeString = url.split(',')[0].split(':')[1].split(';')[0];

  const uint8 = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    uint8[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8], { type: mimeString });
};

export const saveSnapshot = (url: string, name: string) => {
  const linkElement = document.createElement('a');
  linkElement.href = URL.createObjectURL(convertBase64ToBLob(url));
  linkElement.download = name;
  linkElement.click();
  linkElement.remove();
};
