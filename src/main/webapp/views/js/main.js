/*
let d = new Date();
console.log("lala");
alert("Today’s date is " + d);
 */

/**
 *  _eventHandlers специальная переменная в которой хранятся обработчики событий для кнопок.
 *  Всего необходимо 4 кнопки, но во всех кейсах не используется более 2ух за раз.
 *  Чтобы не плодить большого количества кнопок, мы "жанглируем" двумя (меняем Id, listener, name).
 *  К сожалению, так как функция-listener для любой кнопки имеет параметр, мы можем задать ее
 *  только через ананимную функцию, которую впоследствии невозможно снять с кнопки.
 *
 *  На помощь приходит _eventHandlers, который хранит и удаляет ссылки на анонимные функции.
 */
var _eventHandlers = {};
const addListener = (node, event, handler, capture = false) => {
    if (!(event in _eventHandlers)) {
        _eventHandlers[event] = []
    }
    _eventHandlers[event].push({node: node, handler: handler, capture: capture})
    node.addEventListener(event, handler, capture)
}
const removeAllListeners = (targetNode, event) => {
    _eventHandlers[event]
        .filter(({node}) => node === targetNode)
        .forEach(({node, handler, capture}) => node.removeEventListener(event, handler, capture))
    _eventHandlers[event] = _eventHandlers[event].filter(
        ({node}) => node !== targetNode,
    )
}
/**
 * **************************
 */
// Создаём объект класса XMLHttpRequest
const request = new XMLHttpRequest();
/*  Составляем строку запроса */
const url = "/telephones";
/* Здесь мы указываем параметры соединения с сервером, т.е. мы указываем метод соединения GET,
а после запятой мы указываем путь на сервере который будет обрабатывать наш запрос. */
request.open('GET', url);
// Указываем заголовки для сервера, говорим что тип данных, - контент который мы хотим получить должен быть не закодирован.
request.setRequestHeader('Content-Type', 'application/x-www-form-url');
// Здесь мы получаем ответ от сервера на запрос, лучше сказать ждем ответ от сервера
request.addEventListener("readystatechange", () => {
    /*request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) объекта,
    бывает 4 состояния
    request.status это http статус ответа. */
    if (request.readyState === 4 && request.status === 200) {
        const json = JSON.parse(request.responseText);
        let tbody = document.getElementById('table-contacts');
        for (let i = 0; i < json.length; i++) {
            let tr = "<tr name=tr-contact id=tr-contact-" + (i + 1) + ">";
            tr += "<td><input type=text readonly name=owner id=owner-" + (i + 1) + " value=" + (json[i].owner != null ? json[i].owner : ' ') + "></td>" +
                "<td><input type=text readonly id=phone-" + (i + 1) + " value=" + (json[i].phone != null ? json[i].phone : ' ') + "></td>" +
                "<td><label id=date-" + (i + 1) + " >"+(json[i].date != null ? json[i].date : ' ')+"</label></td>" +
                "<td>" + "<input type=button name=btn-edit id=edit-btn-" + (i + 1) + " value=Редактировать>" + "</td>" +
                "<td>" + "<input type=button name=btn-delete id=delete-btn-" + (i + 1) + " value=Удалить>" + "</td>";
            tr += "<input type=hidden id=id-" + (i + 1) + " value=" + json[i].id + "></tr>"
            tbody.innerHTML += tr;
        }
        tbody = document.getElementById('table-line-for-new-contact');
        tr = "<tr>";
        tr += "<td><input type=text id=new-owner></td>" +
            "<td><input type=text id=new-phone></td>" +
            "<td><input type=text readonly id=new-date></td>" +
            "<td>" + "<input type=button id=create-btn value=Добавить></td>";
        tr += "</tr>"
        tbody.innerHTML += tr;
        document.getElementById('create-btn').addEventListener('click', () => {
            funcForCreateBtn()
        });
        enableBtnsFunc();

    }
})
// Выполняем запрос
request.send();


function enableBtnsFunc() {
    const btnsEdit = document.getElementsByName('btn-edit');
    const btnsDelete = document.getElementsByName('btn-delete');
    _eventHandlers = {};
    for (let i = 1; i < btnsEdit.length + 1; i++) {
        //Функция редактировать
        addListener(btnsEdit[i - 1], 'click', () => {
            funcForEditBtn(i);
        })
        //btnsEdit[i - 1].addEventListener('click', () => {funcForEditBtn(i);});
        //Функция удаления
        addListener(btnsDelete[i - 1], 'click', () => {
            funcForDeleteBtn(i);
        })
        //btnsDelete[i - 1].addEventListener('click', () => {funcForDeleteBtn(i);});
    }
}

function funcForEditBtn(contactId) {
    document.getElementById('owner-' + contactId).readOnly = false;
    document.getElementById('phone-' + contactId).readOnly = false;
    document.getElementById('tr-contact-' + contactId).style.background = "red";
    //Функция "сохранить"
    document.getElementById('edit-btn-' + contactId).value = 'Сохранить';
    //document.getElementById('edit-btn-' + contactId).addEventListener('click', () => {funcForUpdateBtn(contactId)});
    removeAllListeners(document.getElementById('edit-btn-' + contactId), 'click');
    addListener(document.getElementById('edit-btn-' + contactId), 'click', () => {
        funcForUpdateBtn(contactId)
    });
    //Функция "отмена"
    document.getElementById('delete-btn-' + contactId).value = 'Отмена';
    //document.getElementById('delete-btn-' + contactId).addEventListener('click', () => {funcForCancelBtn(contactId)});
    removeAllListeners(document.getElementById('delete-btn-' + contactId), 'click');
    addListener(document.getElementById('delete-btn-' + contactId), 'click', () => {
        funcForCancelBtn(contactId)
    });
}

function funcForCancelBtn(contactId) {
    document.getElementById('owner-' + contactId).readOnly = true;
    document.getElementById('phone-' + contactId).readOnly = true;
    document.getElementById('edit-btn-' + contactId).value = 'Редактировать';
    //document.getElementById('edit-btn-' + contactId).addEventListener('click', () => {funcForEditBtn(contactId)});
    removeAllListeners(document.getElementById('edit-btn-' + contactId), 'click');
    addListener(document.getElementById('edit-btn-' + contactId), 'click', () => {funcForEditBtn(contactId)});
    document.getElementById('delete-btn-' + contactId).value = 'Удалить';
    //document.getElementById('delete-btn-' + contactId).addEventListener('click', () => {funcForDeleteBtn(contactId)});
    removeAllListeners(document.getElementById('delete-btn-' + contactId), 'click');
    addListener(document.getElementById('delete-btn-' + contactId), 'click', () => {funcForDeleteBtn(contactId)});
    document.getElementById('tr-contact-' + contactId).style.background = "#ffffff";

    //Пытаемся вернуть значение из БД
    const request = new XMLHttpRequest();
    const url = "/telephones/ajax/"+document.getElementById('id-' + contactId).value;
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            if (request.responseText!="409 CONFLICT") {
                const json = JSON.parse(request.responseText);
                document.getElementById('owner-' + contactId).value = json.owner;
                document.getElementById('phone-' + contactId).value = json.phone;
                document.getElementById('date-' + contactId).innerHTML = json.date;
            } else {
                alert("Ошибка. Запись не найдена");
            }

        }
    })
    request.send();

}

function funcForUpdateBtn(contactId) {
    const request = new XMLHttpRequest();
    const url = "/telephones/ajax/update";
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            if (request.responseText!="409 CONFLICT") {
                const json = JSON.parse(request.responseText);
                document.getElementById('owner-' + contactId).setAttribute("value",  json.owner);
                document.getElementById('phone-' + contactId).setAttribute("value", json.phone);
                document.getElementById('date-' + contactId).setAttribute("value", json.date);
                funcForCancelBtn(contactId);
            } else {
                alert("Ошибка. Запись не обновлена");
            }

        }
    })
    let contact = {
        id: document.getElementById('id-' + contactId).value,
        owner: document.getElementById('owner-' + contactId).value,
        phone: document.getElementById('phone-' + contactId).value
    }
    request.send(JSON.stringify(contact));
}

function funcForDeleteBtn(contactId) {
    const request = new XMLHttpRequest();
    const url = "/telephones/ajax/delete";
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            /* Другой вариант удаления
            document.getElementById('owner-' + contactId).readOnly = true;
            document.getElementById('phone-' + contactId).readOnly = true;
            document.getElementById('edit-btn-' + contactId).value = 'Редактировать';
            document.getElementById('edit-btn-' + contactId).disabled = true;
            document.getElementById('edit-btn-' + contactId).addEventListener('click', null);
            document.getElementById('delete-btn-' + contactId).value = 'Удалить';
            document.getElementById('delete-btn-' + contactId).disabled = true;
            document.getElementById('delete-btn-' + contactId).addEventListener('click', null);
            document.getElementById('tr-contact-' + contactId).style.background = "black";
            */
            document.getElementById('tr-contact-' + contactId).remove();
        }
    })
    let contact = {
        id: document.getElementById('id-' + contactId).value,
        owner: document.getElementById('owner-' + contactId).value,
        phone: document.getElementById('phone-' + contactId).value
    }
    request.send(JSON.stringify(contact));
}

function funcForCreateBtn() {
    let currentPosition = document.getElementById('table-contacts').rows.length + 1
    const request = new XMLHttpRequest();
    const url = "/telephones/ajax/create";
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            const json = JSON.parse(request.responseText);
            let tbody = document.getElementById('table-contacts');
            let tr = "<tr name=tr-contact id=tr-contact-" + currentPosition + ">";
            tr += "<td><input type=text readonly name=owner id=owner-" + currentPosition + " value=" + (json.owner != null ? json.owner : ' ') + "></td>" +
                "<td><input type=text readonly id=phone-" + currentPosition + " value=" + (json.phone != null ? json.phone : ' ') + "></td>" +
                "<td><label id=date-" + currentPosition + " >"  + (json.date != null ? json.date : ' ') + "</label></td>" +
                "<td>" + "<input type=button name=btn-edit id=edit-btn-" + currentPosition + " value=Редактировать>" + "</td>" +
                "<td>" + "<input type=button name=btn-delete id=delete-btn-" + currentPosition + " value=Удалить>" + "</td>";
            tr += "<input type=hidden id=id-" + currentPosition + " value=" + json.id + "></tr>"
            tbody.innerHTML += tr;
            document.getElementById('owner-' + currentPosition).value = json.owner;
            document.getElementById('phone-' + currentPosition).value = json.phone;
            document.getElementById('date-' + currentPosition).value = json.date;
            document.getElementById('new-owner').value = "";
            document.getElementById('new-phone').value = "";
            enableBtnsFunc();
        }
    })
    let contact = {
        owner: document.getElementById('new-owner').value,
        phone: document.getElementById('new-phone').value
    }
    request.send(JSON.stringify(contact));
}