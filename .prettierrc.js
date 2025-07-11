module.exports = {
  // semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindAttributes: ['theme'],
  tailwindFunctions: ['twMerge', 'createTheme'],
};
