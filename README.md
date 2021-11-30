# web_security_ssrf_example
Пример приложения, уязвимого к SSRF атакам (Server-side request forgery).

## Установка и запуск

Для загрузки приложения необходимо скопировать репозиторий к себе на систему. Можно это сделать при помощи команды:

```shell
git clone https://github.com/NikitaPetaichuk/web_security_ssrf_example.git
```

Для запуска приложения необходимо:

* убедиться, что на системе установлен Node.jS и npm. На Ubuntu 20.04 их можно установить следующими командами:

```shell
sudo apt install nodejs
sudo apt install npm
```

* установить себе все зависимости, что можно сделать, выполнив следующую команду в папке с приложением:

```shell
npm install
```

Запуск осуществляется следующим образом:

* Запускается сервер file_handler_server.js (эта и далее команды осуществляются из папки с приложением):

```shell
node file_handler_server.js
```

* Запускается само приложение:

```shell
node bin/www
```
