document.addEventListener("DOMContentLoaded",function(event)
{
    var form = document.getElementById("todoForm");
    var inputValue = document.getElementById("text1");
    var dateValue = document.getElementById("date1");
    var checkedBtn = document.getElementById("exampleCheck1");
    var buttonClick = document.getElementById("button1");
    var pendind_tasks = document.getElementById("pendingTasks");
    var completed_tasks = document.getElementById("completedTasks");
    var taskArr = JSON.parse(localStorage.getItem("data")) || [];
    var currentId = 1;
    var chechedTextOfButton;
    var editingId;
    var inputSearch = document.getElementById("search1");
    
    function saveTodoList()
    {
        localStorage.setItem("data",JSON.stringify(taskArr));
    }
    
    async function fetchTodo(url)
    {
        if(taskArr.length == 0)
        {
            var request = await fetch(url)
            .then((response) =>  response.json())
            .then((todos) => {
                const createdDate = new Date();
                let yyyy = createdDate.getFullYear();
                let mm = createdDate.getMonth()+1;
                let dd = createdDate.getDate();
    
                if(mm < 10) mm="0"+mm;
                if(dd < 10) dd="0"+dd;
    
                const format = `${yyyy}-${mm}-${dd}`;
                //console.log(format);
    
                //console.log(todos);
    
                taskArr = todos.map((x) => {
                    return {...x , date:format};
                });
                console.log(taskArr);

            });
            saveTodoList();
        }
        
        currentId = taskArr.length + 1 ;
        renderToDoList();
        

    }
    fetchTodo("https://jsonplaceholder.typicode.com/todos?_start-0&_limit=8");



    form.addEventListener("submit",function(event)
{
    console.log(currentId);
    event.preventDefault();
    console.log(event);
    let dateObj = new Date(event.target[2].value);
    let yyyy = dateObj.getFullYear();
    let dd = dateObj.getDate();
    let mm = dateObj.getMonth() + 1;

    mm = mm < 10 ? "0" + mm : mm;
    dd = dd < 10 ? "0" + dd : dd;

    let formattedDate = `${yyyy}-${mm}-${dd}`;

    var newTodo = {
        userId:1,
        id:currentId++,
        title:event.target[1].value,
        date:formattedDate,
        checked:event.target[0].checked
    };

    console.log(newTodo);

    if (editingId) {
        taskArr = taskArr.filter(item => item.id !== editingId);
        newTodo.id = editingId;
        editingId = null;
    }
    chechedTextOfButton = 1;
    taskArr.push(newTodo);
    form.reset();
    renderToDoList();
    saveTodoList();
});
inputSearch.addEventListener("input",(event) => {
    var val = event.target.value;
    if(val.length > 3)
    {
        taskArr = taskArr.filter((item) => {
            if(item.title.includes(val))
            {
                return item;
            }
        })
    }
    else
    {
        taskArr = JSON.parse(localStorage.getItem("data"));
    }
    renderToDoList();
})
window.deleteTodo = function (id)
{
    var item = taskArr.find((x) => x.id == id);
    taskArr = taskArr.filter(function(item)
{
    return item.id !== id;
});
renderToDoList();
saveTodoList();
}

window.changeStatus = function(id)
{
    item = taskArr.find((x) => x.id == id);
    item.checked = !item.checked;
    renderToDoList();
    saveTodoList();
}

window.editValue = function(id)
{
    item = taskArr.find((x) => x.id == id);
    inputValue.value = item.title;
    checkedBtn.value = item.checked;

    let dateObj = new Date(item.date);
    let yyyy = dateObj.getFullYear();
    let mm = dateObj.getMonth() + 1; // إضافة 1 لأن getMonth() يبدأ من 0
    let dd = dateObj.getDate(); // استخدام getDate() بدلاً من getDay()

    // ضمان أن يكون الشهر واليوم بصيغة رقمين
    mm = mm < 10 ? "0" + mm : mm;
    dd = dd < 10 ? "0" + dd : dd;

    dateValue.value = `${yyyy}-${mm}-${dd}`; 

    chechedTextOfButton = 0;
    editingId = id;
    renderToDoList();
    saveTodoList();
}
function renderToDoList()
{
    pendind_tasks.innerHTML ="";
    completed_tasks.innerHTML ="";

    // ترتيب المهام تصاعديًا حسب الـ ID
    taskArr.sort((a, b) => a.id - b.id);

    taskArr.forEach(function(item , index){
        var newli = document.createElement("li");
        newli.innerHTML =
        `
        <div class="mt-2">
        <span>${item.id} "${item.title}" - ${item.date}</span>
        <div>
        <button class="btn btn-success btn-sm me-2" onclick="changeStatus(${item.id})">${item.checked ? "Undo" : "Complete"}</button>
        <button ${item.checked ? "disabled" : ""} class="btn btn-warning btn-sm me-2" onclick="editValue(${item.id})">Edit</button>
        <button id="btn1" class="btn btn-danger btn-sm me-2" onclick=" deleteTodo(${item.id})" >Delete</button>
        </div>
        </div>
        `;
        newli.querySelector("span").style.textDecoration = item.checked ? "line-through" : "none";

        if(chechedTextOfButton == 0)
        {
            buttonClick.innerText = "Edit ToDo"
        }
        else
        {
            buttonClick.innerText = "Add Task";
        }
        if(item.checked)
        {
            completed_tasks.appendChild(newli);
        }
        else{
            pendind_tasks.appendChild(newli);
        }

    })
}

})


