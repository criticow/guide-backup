# Info

- É preciso criar um banco de dados postgresql
- É preciso adicionar a connection string ao .env do backend
- É preciso configurar a url que o site e o app estão usando pra se comunicarem com o backend em <app_folder>/src/environments/...
- Entre outras coisinhas

## Web

- Angular
- Tailwindcss

### Dev server

```
cd web
npm install
ng serve
```

### Build

```
cd web
ng build
```

## Mobile

- Ionic
- Angular
- Tailwindcss


### Dev server

```
cd mobile
npm install
ionic serve
```

### Build

```
cd mobile
ionic capacitor add android
ionic capacitor sync
ionic capacitor build android --prod
```

## Backend

- Express
- Prisma
- Postgresql

### Serve

```
cd backend
npm install
npm start
```

### Build

```
cd backend
npm run build
```