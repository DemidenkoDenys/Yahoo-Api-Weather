 1. Проверяем версию node.js (должна быть 0.10.25) и npm (должна быть 2.3.0)
 node -v
 npm -v
 
 	Если версия не совпадает, обновляем таким образом:
 sudo npm cache clean -f
 sudo npm install -g n
 sudo n stable

 2. Устанавливаем нужные модули
 sudo npm install

 4. Запускаем gulp
 gulp
 