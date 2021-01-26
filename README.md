# Word-search

## About
Word search is a tiny game that is about crossing out all the words on the board. You can choose in many words categories and three different levels of difficulty. Application is fully installable (PWA) and adapted to all kind of devices.

## Demo
https://wykreśl.pl

## Project setup
```
npm i
```

### Development
```
npm run serve
```

### Compile for production
```
npm run build
```

### Configuration
* Categories
You can add your own categories at `/src/assets/words` and register them in `/src/components/Board.vue` file in `categories` array.
* SEO
All the meta tags are in `.env` file.

### Project created with Vue CLI
See [Configuration Reference](https://cli.vuejs.org/config/).
