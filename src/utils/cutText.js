const cutText = (text) => {
  if (text.length > 150) {
    for (let i = 150; i > 0; i--) {
      if (
        text.charAt(i) === ' ' &&
        (text.charAt(i - 1) !== ',' || text.charAt(i - 1) !== '.' || text.charAt(i - 1) !== ';')
      ) {
        return `${text.substring(0, i)}...`;
      }
    }
  }
  return text;
};

export default cutText;
