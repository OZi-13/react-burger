# Stellar Burgers

Учебный проект на React и TypeScript: SPA для бургерной Stellar Burgers с конструктором заказа, авторизацией, личным кабинетом и realtime-лентой заказов.

## Возможности

- загрузка ингредиентов из API;
- отображение ингредиентов по категориям;
- конструктор бургера с подсчётом стоимости;
- drag-and-drop добавление и сортировка ингредиентов;
- оформление заказа для авторизованного пользователя;
- модальные окна и отдельные страницы деталей ингредиента и заказа;
- регистрация, вход, выход, восстановление пароля и редактирование профиля;
- публичная лента заказов и история заказов пользователя через WebSocket.

## Технологии

- React;
- TypeScript;
- Vite;
- Redux Toolkit;
- React Router;
- CSS Modules;
- React DnD;
- WebSocket;
- Vitest;
- Playwright;
- UI-компоненты Stellar Burgers.

## Деплой

Приложение опубликовано на GitHub Pages: https://ozi-13.github.io/react-burger/

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run lint
npm run check
npm run test -- --run
npm run e2e
npm run build
```
