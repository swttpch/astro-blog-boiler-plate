export const getStyleBackgroundImage = (url?: string) => {
  return `background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), linear-gradient(0deg, var(--primary-500) 0%, var(--primary-500) 100%) ${(url && `, url('${url || ''}') lightgray 50% / cover no-repeat`) || ''};`;
};
