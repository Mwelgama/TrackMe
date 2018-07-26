const devices = JSON.parse(localStorage.getItem('devices')) || [];
const API_URL = 'http://localhost:5000/api';

const currentUser = localStorage.getItem('user')
if (currentUser) {
 $.get(`${API_URL}/users/${currentUser}/devices`)
 .then(response => {
 response.forEach((device) => {

 $('#devices tbody').append(`
 <tr data-device-id=${device._id}>
 <td>${device.user}</td>
 <td>${device.name}</td>
 </tr>`
 );
 });
 $('#devices tbody tr').on('click', (e) => {
    const deviceId = e.currentTarget.getAttribute('data-device-id');
    $.get(`${API_URL}/devices/${deviceId}/device-history`)
    .then(response => {
        response.map(sensorData => {
            $('#historyContent').append(`
            <tr>
            <td>${sensorData.ts}</td>
            <td>${sensorData.temp}</td>
            <td>${sensorData.loc.lat}</td>
            <td>${sensorData.loc.lon}</td>
            </tr>
            `);
           });
           $('#historyModal').modal('show');           
    });
   });
})
 .catch(error => {
 console.error(`Error: ${error}`);
 });
}
else {
    const path = window.location.pathname;
    if (path == '/registration'){
    }
    else if (path !== '/login') {
    location.href = '/login';
    }
   }
   
   
   

// const response = $.get(`${API_URL}/devices`)
// .then(response => {
//     for (let key of response) {
//     $('#devices tbody').append(`
//     <tr>
//     <td>${key.user}</td>
//     <td>${key.name}</td>
//     </tr>`);   
// };
// })
// .catch(error => {
//  console.log(`Error: ${error}`);
// });


// const devices = [];
    // devices.push({User: "Mary", Name: "Mary's Phone"});
    // devices.push({User: "Alex", Name: "Alex's Surface Pro"});
    // devices.push({User: "Mary", Name: "Mary's Macbook"});



// commentdd
    $('#add-device').on('click', function(){
    const user = $('#user').val();
    const name = $('#name').val()
    const sensorData = [];
    const body = {
        name,
        user,
        sensorData
    };
    $.post(`${API_URL}/devices`, body)
    .then(response => {
        location.href = "/"
    })
    .catch(error => {
        console.log(`Error: ${error}`);
    });
    });

    $('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
   });

   $('#RegisterCreate').on('click', function() {
    const user = $('#userName').val();
    const passwordInput = $('#password').val();
    const password2 = $('#passwordConfirm').val()
    const confirm = passwordInput == password2;
    const body = {
        user,
        passwordInput,
    };
    // if(localStorage.getItem(user))
    //     console.log("User Already Exists.");
    // const users = JSON.parse(localStorage.getItem('users')) || [];
    // const exists = users.find((user => user.name === userName));
    if (!confirm){
        $('#passwordError').append('<p class="alert alert-danger" style="font-style: italic"> ERROR: Password does not match </p>')
    }
    else
    $.post(`${API_URL}/register`, body)
    .then(response  => {
        location.href = "/"
    })
    .catch(error => {
        console.log(`Error: ${error}`);
    }
    )});

   $('#RegisterLogin').on('click', () => {
    const user = $('#userNameLogin').val();
    const passwordInput = $('#passwordLogin').val();
    $.post(`${API_URL}/authenticate`, { user, passwordInput })
    .then((response) =>{
    if (response.success) {
    localStorage.setItem('user', user);
    localStorage.setItem('isAdmin', response.isAdmin);
    location.href = '/';
    } else {
    $('#loginError').append(`<p class="alert alert-danger">${response}
   </p>`);
    }})});

   const logout = () => {
    localStorage.removeItem('user');
    location.href = '/login';
   }

$('#navbar').load('navbar.html');
$('#footer').load('footer.html');


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith,Content-Type, Accept");
//     next();
//    });