'use strict'
// определяем все кнопочти и всё такое, что будем использовать
let submission_button = document.getElementById("submission");
let condition = document.getElementById("condition");
let clear_button = document.getElementById("clear");
let tg = window.Telegram.WebApp;

// определяем все onclick
for (var i = 0; i < 100; i++) {
    document.getElementById("button" + i).onclick = create_button_func(i);
    };
submission_button.onclick = submission_button_onclick;
clear_button.onclick = clear_button_onclick;


//вспомогательные общие переменные
let field = Array(10);
for (var i = 0; i < 10; i ++) {
    field[i] = Array(10);
}

/*
функция нажатия кнопки submission, преобразует данные из field в 0 и 1 и отправляет боту
*/
function submission_button_onclick(){
    var data = "";
    for (var i  = 0; i < 10; i ++){
        for (var j = 0; j < 10; j ++){
            if(field[i][j]){
                data += "1 ";
            }
            else{
                data += "0 ";
            }
        }
        data += "\n";
    }
    tg.sendData(data); 
}

/*
создает функцию нажатия для кнопок внутри поля по номеру кнопки
*/
function create_button_func(number){
    /*
    функция нажатия кнопки, меняет цвет с белого на голубой и обратно при нажатии, 
    а так же заполняет поле field, 
    если кнопка нажата, то в field лежит true, а сама кнопка голубая
    если нет, то в field лежит flase/None, а кнопка белая

    так же при нажатии активирует проверку поля (check_field) и меняет состояние кнопки submission
    и выводит сообщение если что не так 
    */
    function button_func(){
        if(field[Math.floor(number/10)][number % 10]){
            document.getElementById("button" + number).style.backgroundColor='white';
            field[Math.floor(number/10)][number % 10] = false;
        }
        else{
            document.getElementById("button" + number).style.backgroundColor='#bde0ff';
            field[Math.floor(number/10)][number % 10] = true;
        }
        var res = check_field();
        if(! res[0]){
            submission_button.disabled = true;
            condition.textContent = res[1];
            condition.style.color = 'red';
            cond_cond = true;
        }
        else{
            condition.textContent = "";
            submission_button.disabled = false;
        }
    }
    return button_func;
}
/*
создает функцию нажатия для кнопоки очистить поле, 
собсвенно очищает поле -- все кнопки внутри белые, все значения field false
ну и в конце запускает check_field
*/
function clear_button_onclick(){
    for(var i = 0; i < 10; i++){
        for(var j =0; j < 10; j++){
            field[i][j] = false;
            document.getElementById("button" + (i * 10 + j)).style.backgroundColor='white';
        }
    }
    check_field();
}

/*
функция проверки поля на корректноть расстановки
1) если вернула [true], то всё с полем хорошо 
2) если [false, message], то не в порядке по причине message, бывает 3 типа:
    - Слишком близко стоят
    - Не то количество кораблей
    - Корабль слишком большой

Так же, если проблема в количестве кораблей, то выводит количество каждого типа 
и подсвечивает зеленым или красным взависимости от корректности
*/
function check_field(){
    for(var i = 1; i <= 4; i++){
        document.getElementById(i + "c").textContent = "";
        document.getElementById(String(i)).textContent = "";
    }
    let visited = Array(100);
    var count = [0, 0, 0, 0]; //количество кораблей с i+1 палубой
    let mess1 = "Слишком близко стоят", mess2 = "Не то количество кораблей", mess3 = "Корабль слишком большой";
    for (var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(visited[i * 10 + j]){ // елси клетку посещалиЮ, то скип
                continue;
            }
            if(field[i][j]){
                var right = j, down = i; //правая и нижняя граница корабля соответсвенно
                while(field[i][right]){ // идём вправо, пока есть корабль
                    visited[i * 10 + right] = true; //отмечаем посещение
                    right++;
                    if(right == 10){
                        break;
                    }
                }
                while(field[down][j]){ // идём вниз, пока есть корабль
                    visited[down * 10 + j] = true;//отмечаем посещение
                    down++;
                    if(down == 10){
                        break;
                    }
                }
                right--;
                down--;
                if(Math.max(right-j, down - i) > 3){
                    //случай, если корабль слишком большого размера
                    return [false, mess3]; 
                }
                count[Math.max(right-j, down - i)]++; //записываем найденный кораблик
                if(down == i){ //проверка на соседей, если корабль идёт вправо 
                    for(var k = j-1; k <= right + 1; k ++){
                        if(field_cell(i+1, k) | field_cell(i-1, k)){
                            return [false, mess1];
                        }  
                    }
                    if(field_cell(i, right + 1) | field_cell(i, j-1)){
                        return [false, mess1];
                    }
                }
                if(right == j){//проверка на соседей, если корабль идёт вниз 
                    for(var k = i-1; k <= down + 1; k ++){
                        if(field_cell(k, j + 1) | field_cell(k, j - 1)){
                            return [false, mess1];
                        }
                    }
                    if(field_cell(down + 1, j) | field_cell(i-1, j)){
                        return [false, mess1];
                    }
                }
            }
            else{// ессли корабль не стоит, то просто посетили клетку
                visited[i * 10 + j] = true;
            }
        }
    }
    for (var i = 1; i <= 4; i++){//записываем количество кораблей
        color_and_set_count(i, count[i-1]);
    }
    //стандатрный набор для сообщений о количестве кораблей
    document.getElementById(1).textContent = " из 4 однопалубных кораблей";
    document.getElementById(2).textContent = " из 3 двупалубных кораблей";
    document.getElementById(3).textContent = " из 2 трёхпалубных кораблей";
    document.getElementById(4).textContent = " из 1 четырёхпалубных кораблей";
    if(count[3] == 1 & count[2] == 2 & count[1] == 3 & count[0] == 4){
        return [true]
    }
    return [false, mess2];
}

/*
просто выдает false, если вылезли за пределы поля, иначе значение поля
*/
function field_cell(x, y){
    if(x > 9 | y > 10 | x < 0 | y < 0 ){
        return false;
    }
    return field[x][y]
}

/*
по номеру записывает количество кораблей и красит в нужный цвет
*/
function color_and_set_count(number, count){
    document.getElementById(number + "c").textContent = count;
    if(count == (4 - number + 1)){
        document.getElementById(number + "c").style.color = 'green';
    }
    else{
        document.getElementById(number + "c").style.color = 'red';
    }
}