export const isValidFacebookUrl = (url) => {
  const fbRegex =
    /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;

  return fbRegex.test(url);
};
