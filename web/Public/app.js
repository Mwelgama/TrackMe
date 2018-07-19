const devices = JSON.parse(localStorage.getItem('devices')) || [];
const API_URL = 'http://localhost:5000/api';
const response = $.get(`${API_URL}/devices`)
.then(response => {
    for (let key of response) {
    $('#devices tbody').append(`
    <tr>
    <td>${key.user}</td>
    <td>${key.name}</td>
    </tr>`);   
};
})
.catch(error => {
 console.log(`Error: ${error}`);
});


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
    const userName = $('#userName').val();
    const password1 = $('#password').val();
    const password2 = $('#passwordConfirm').val()
    // if(localStorage.getItem(user))
    //     console.log("User Already Exists.");
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.find((user => user.name === userName));
    if (exists){
        $('#messageError').append('<p class="alert alert-danger" style="font-style: italic" >User already exists. Click <a href="/login">here</a> to login. </p>');
        
    }
    else if (password1 !== password2){
        $('#passwordError').append('<p class="alert alert-danger" style="font-style: italic"> ERROR: Password does not match </p>')
    }
    else
    {
        users.push({name: userName, password: password2})
        localStorage.setItem('users', JSON.stringify(users));
        location.href = "/login";
    }
   });

   $('#RegisterLogin').on('click', function() {
       const userNameLogin = $('#userNameLogin').val();
       const passwordLogin = $('#passwordLogin').val();
       let isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated')) || false;
       const users = JSON.parse(localStorage.getItem('users')) || [];
       const existingLogin = users.find((user => (user.name === userNameLogin) && (user.password === passwordLogin)));
    //    const passowrdExist = users.find((user => user.password === passwordLogin));

       if (!existingLogin){
            // isAuthenticated = false;
            // localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
            $('#loginError').append('<p class="alert alert-danger" style="font-style: italic"> ERROR: User name or Passowrd does not exist. </p>')
       }
       else{
        isAuthenticated = true;
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        location.href = "/"}
   });
   const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
   }

$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

