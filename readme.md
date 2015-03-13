 1. Проверяем версию node.js (должна быть 0.10.25) и npm (должна быть 2.3.0)<br>
 node -v<br>
 npm -v<br>
 <br>
 	Если версия не совпадает, обновляем таким образом:<br>
 sudo npm cache clean -f<br>
 sudo npm install -g n<br>
 sudo n stable<br>
<br>
 2. Устанавливаем нужные модули<br>
 sudo npm install<br>
<br>
 4. Запускаем gulp<br>
 gulp<br>
 